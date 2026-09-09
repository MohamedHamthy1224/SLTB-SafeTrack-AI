from datetime import datetime, date, timedelta, timezone
from sqlalchemy import func, distinct, or_
from app.data.database import db
from app.data.models.activity_log_model import UserActivityLogModel
from app.data.models.session_model import UserSessionModel
from app.data.models.user_model import UserModel
from app.data.repositories.activity_log_repository import ActivityLogRepository
from app.data.repositories.session_repository import SessionRepository
from app.data.repositories.user_repository import UserRepository
from app.business.services.websocket_service import WebSocketService
from sqlalchemy.exc import SQLAlchemyError

class SystemLogServiceError(Exception):
    def __init__(self, message, errors=None, status_code=400):
        super().__init__(message)
        self.message = message
        self.errors = errors or {}
        self.status_code = status_code

class SystemLogService:

    def __init__(self, activity_repo=None, session_repo=None, user_repo=None, websocket_service=None):
        self.activity_repo = activity_repo or ActivityLogRepository()
        self.session_repo = session_repo or SessionRepository()
        self.user_repo = user_repo or UserRepository()
        self.websocket_service = websocket_service or WebSocketService()

    def log_activity(self, user_id, activity_desc):
        """
        Centralized activity logging service:
        1. Validates activity.
        2. Inserts activity into user_activity_logs.
        3. Commits database transaction.
        4. Only after successful commit, emits WebSocket 'system_log_created' event.
        """
        if not user_id or not activity_desc:
            return None

        try:
            log = UserActivityLogModel(
                user_id=user_id,
                activity=str(activity_desc).strip(),
                activity_time=datetime.now(timezone.utc)
            )
            db.session.add(log)
            db.session.commit()

            # Retrieve username for real-time WebSocket payload
            user = self.user_repo.get_by_id(user_id)
            username = user.username if user else f"User {user_id}"
            time_str = log.activity_time.strftime('%Y-%m-%d %H:%M:%S') if log.activity_time else datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')

            payload = {
                "activityId": log.activity_id,
                "userId": log.user_id,
                "username": username,
                "activity": log.activity,
                "activityTime": time_str
            }

            # Emit real-time Socket.IO event after successful DB commit
            self.websocket_service.emit_system_log_created(payload)
            return payload
        except SQLAlchemyError as e:
            db.session.rollback()
            return None
        except Exception:
            db.session.rollback()
            return None

    def get_logs(self, keyword=None, user_id=None, start_date=None, end_date=None, sort_by=None, sort_order='desc', page=None, per_page=None):
        try:
            query = db.session.query(
                UserActivityLogModel,
                UserModel.username
            ).join(UserModel, UserActivityLogModel.user_id == UserModel.user_id)

            if user_id and str(user_id).lower() != 'all users':
                try:
                    uid = int(user_id)
                    query = query.filter(UserActivityLogModel.user_id == uid)
                except ValueError:
                    pass

            if keyword:
                kw = f"%{keyword.strip()}%"
                search_conditions = [
                    UserActivityLogModel.activity.ilike(kw),
                    UserModel.username.ilike(kw)
                ]
                if str(keyword).strip().isdigit():
                    search_conditions.append(UserActivityLogModel.activity_id == int(keyword.strip()))
                    search_conditions.append(UserActivityLogModel.user_id == int(keyword.strip()))
                query = query.filter(or_(*search_conditions))

            if start_date:
                try:
                    s_dt = datetime.strptime(start_date, "%Y-%m-%d")
                    query = query.filter(UserActivityLogModel.activity_time >= s_dt)
                except ValueError:
                    pass

            if end_date:
                try:
                    e_dt = datetime.strptime(end_date, "%Y-%m-%d").replace(hour=23, minute=59, second=59)
                    query = query.filter(UserActivityLogModel.activity_time <= e_dt)
                except ValueError:
                    pass

            # Safe Sorting
            is_asc = str(sort_order).lower() == 'asc'
            if sort_by == 'activityId':
                order_col = UserActivityLogModel.activity_id.asc() if is_asc else UserActivityLogModel.activity_id.desc()
            elif sort_by == 'userId':
                order_col = UserActivityLogModel.user_id.asc() if is_asc else UserActivityLogModel.user_id.desc()
            elif sort_by == 'username':
                order_col = UserModel.username.asc() if is_asc else UserModel.username.desc()
            else:
                order_col = UserActivityLogModel.activity_time.asc() if is_asc else UserActivityLogModel.activity_time.desc()

            query = query.order_by(order_col)

            total_count = query.count()

            if page is not None and per_page is not None:
                p = max(1, int(page))
                pp = max(1, min(100, int(per_page)))
                query = query.offset((p - 1) * pp).limit(pp)

            logs_db = query.all()

            results = []
            for log, uname in logs_db:
                results.append({
                    "activityId": log.activity_id,
                    "userId": log.user_id,
                    "username": uname,
                    "activity": log.activity,
                    "activityTime": log.activity_time.strftime('%Y-%m-%d %H:%M:%S') if log.activity_time else ""
                })

            if page is not None and per_page is not None:
                pp = max(1, min(100, int(per_page)))
                return {
                    "logs": results,
                    "pagination": {
                        "page": int(page),
                        "perPage": pp,
                        "total": total_count,
                        "totalPages": (total_count + pp - 1) // pp
                    }
                }

            return results
        except SQLAlchemyError as e:
            raise SystemLogServiceError("Failed to fetch system logs from database.", status_code=500) from e

    def get_summary(self):
        try:
            total_activities = db.session.query(func.count(UserActivityLogModel.activity_id)).scalar() or 0
            unique_users = db.session.query(func.count(distinct(UserActivityLogModel.user_id))).scalar() or 0

            today = date.today()
            today_start = datetime.combine(today, datetime.min.time())
            today_end = datetime.combine(today, datetime.max.time())
            today_activities = db.session.query(func.count(UserActivityLogModel.activity_id)).filter(
                UserActivityLogModel.activity_time >= today_start,
                UserActivityLogModel.activity_time <= today_end
            ).scalar() or 0

            start_of_week = today_start - timedelta(days=today.weekday())
            weekly_activities = db.session.query(func.count(UserActivityLogModel.activity_id)).filter(
                UserActivityLogModel.activity_time >= start_of_week
            ).scalar() or 0

            return {
                "totalActivities": total_activities,
                "uniqueUsers": unique_users,
                "todayActivities": today_activities,
                "weeklyActivities": weekly_activities
            }
        except SQLAlchemyError as e:
            raise SystemLogServiceError("Failed to compute system logs summary stats.", status_code=500) from e

    def get_users_options(self):
        try:
            users_db = db.session.query(
                UserModel.user_id,
                UserModel.username
            ).order_by(UserModel.username.asc()).all()

            return [{"userId": u.user_id, "username": u.username} for u in users_db]
        except SQLAlchemyError as e:
            raise SystemLogServiceError("Failed to fetch user options.", status_code=500) from e

    def get_activity_by_day(self):
        try:
            # Group by DATE(activity_time) for last 7 days
            seven_days_ago = datetime.now() - timedelta(days=7)
            results = db.session.query(
                func.date(UserActivityLogModel.activity_time).label('day_date'),
                func.count(UserActivityLogModel.activity_id).label('log_count')
            ).filter(
                UserActivityLogModel.activity_time >= seven_days_ago
            ).group_by(
                func.date(UserActivityLogModel.activity_time)
            ).order_by(
                func.date(UserActivityLogModel.activity_time).asc()
            ).all()

            data = []
            for r in results:
                d_str = r.day_date.strftime('%d %b') if hasattr(r.day_date, 'strftime') else str(r.day_date)
                data.append({
                    "date": d_str,
                    "count": r.log_count
                })

            if not data:
                # Return empty 7-day scaffold
                for i in range(6, -1, -1):
                    dt = date.today() - timedelta(days=i)
                    data.append({"date": dt.strftime('%d %b'), "count": 0})

            return data
        except SQLAlchemyError as e:
            raise SystemLogServiceError("Failed to compute activity by day chart data.", status_code=500) from e

    def get_user_distribution(self):
        try:
            results = db.session.query(
                UserModel.username,
                func.count(UserActivityLogModel.activity_id).label('log_count')
            ).join(
                UserModel, UserActivityLogModel.user_id == UserModel.user_id
            ).group_by(
                UserModel.username
            ).order_by(
                func.count(UserActivityLogModel.activity_id).desc()
            ).limit(5).all()

            return [{"username": r.username, "count": r.log_count} for r in results]
        except SQLAlchemyError as e:
            raise SystemLogServiceError("Failed to compute user distribution chart data.", status_code=500) from e

    def get_recent_activities(self, limit=10):
        try:
            logs_db = db.session.query(
                UserActivityLogModel,
                UserModel.username
            ).join(
                UserModel, UserActivityLogModel.user_id == UserModel.user_id
            ).order_by(
                UserActivityLogModel.activity_time.desc()
            ).limit(limit).all()

            results = []
            for log, uname in logs_db:
                results.append({
                    "activityId": log.activity_id,
                    "userId": log.user_id,
                    "username": uname,
                    "activity": log.activity,
                    "activityTime": log.activity_time.strftime('%Y-%m-%d %H:%M:%S') if log.activity_time else ""
                })
            return results
        except SQLAlchemyError as e:
            raise SystemLogServiceError("Failed to fetch recent activities.", status_code=500) from e

    def get_sessions(self):
        try:
            sessions_db = db.session.query(
                UserSessionModel,
                UserModel.username
            ).join(
                UserModel, UserSessionModel.user_id == UserModel.user_id
            ).order_by(
                UserSessionModel.login_time.desc()
            ).limit(20).all()

            results = []
            for s, uname in sessions_db:
                results.append({
                    "sessionId": s.session_id,
                    "userId": s.user_id,
                    "username": uname,
                    "loginTime": s.login_time.strftime('%Y-%m-%d %H:%M:%S') if s.login_time else "",
                    "logoutTime": s.logout_time.strftime('%Y-%m-%d %H:%M:%S') if s.logout_time else "Active Session",
                    "ipAddress": s.ip_address or "127.0.0.1",
                    "deviceInfo": s.device_info or "Unknown Device"
                })
            return results
        except SQLAlchemyError as e:
            raise SystemLogServiceError("Failed to fetch user session logs.", status_code=500) from e

    def export_pdf(self, keyword=None, user_id=None, start_date=None, end_date=None, request_user_id=None):
        """
        Generates clean multi-page binary PDF format stream for System Logs Report.
        """
        logs = self.get_logs(keyword=keyword, user_id=user_id, start_date=start_date, end_date=end_date)
        summary = self.get_summary()

        cols = [
            {'header': 'Log ID', 'key': 'activityId', 'width': 8, 'align': 'left'},
            {'header': 'User ID', 'key': 'userId', 'width': 8, 'align': 'left'},
            {'header': 'Username', 'key': 'username', 'width': 16, 'align': 'left'},
            {'header': 'Activity Time', 'key': 'activityTime', 'width': 19, 'align': 'left'},
            {'header': 'Activity Description', 'key': 'activity', 'width': 44, 'align': 'left'},
        ]

        summary_metrics = {
            'Total Activities': summary.get('totalActivities', 0),
            'Unique Users': summary.get('uniqueUsers', 0),
            'Today': summary.get('todayActivities', 0),
            'Weekly': summary.get('weeklyActivities', 0)
        }

        filter_info = {
            'Search': keyword if keyword else None,
            'User': user_id if user_id and user_id != 'All Users' else None,
            'Start Date': start_date if start_date else None,
            'End Date': end_date if end_date else None
        }

        # Activity log
        if request_user_id:
            try:
                from app.data.repositories.activity_log_repository import ActivityLogRepository
                ActivityLogRepository().log_activity(request_user_id, "Exported System Logs PDF report.")
            except Exception:
                pass

        from app.business.services.pdf_generator_service import PDFGeneratorService
        return PDFGeneratorService.generate_report_pdf(
            title="SLTB SAFETRACK AI - POLICE SYSTEM ACTIVITY LOGS REPORT",
            columns=cols,
            rows=logs,
            summary_metrics=summary_metrics,
            filter_info=filter_info,
            user_info=f"User #{request_user_id}" if request_user_id else "Police Admin"
        )

