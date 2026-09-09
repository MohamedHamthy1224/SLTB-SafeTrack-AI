from app.data.database import db
from app.data.models.bus_alert_model import BusAlertModel
from app.data.models.bus_model import BusModel
from app.data.models.notification_model import NotificationModel
from app.data.models.sensor_data_model import SensorDataModel
from sqlalchemy import func, or_, cast, String, and_
from datetime import datetime, timezone, timedelta

class BusAlertRepository:

    def _build_base_query(self, filters=None):
        filters = filters or {}
        query = db.session.query(
            BusAlertModel,
            BusModel,
            NotificationModel,
            SensorDataModel
        ).outerjoin(
            BusModel, BusModel.bus_id == BusAlertModel.bus_id
        ).outerjoin(
            NotificationModel, NotificationModel.bus_alert_id == BusAlertModel.bus_alert_id
        ).outerjoin(
            SensorDataModel, SensorDataModel.sensor_data_id == BusAlertModel.sensor_data_id
        )

        # 1. Priority Filter
        priority = filters.get('priority')
        if priority and str(priority).strip().lower() not in ('all', 'all priorities'):
            p_val = priority.strip().capitalize()
            query = query.filter(func.coalesce(NotificationModel.priority, 'Medium').ilike(p_val))

        # 2. Search Filter
        search = filters.get('search')
        if search and str(search).strip():
            s = str(search).strip()
            search_conds = [
                BusModel.bus_number.ilike(f'%{s}%'),
                BusModel.registration_number.ilike(f'%{s}%'),
                BusModel.model.ilike(f'%{s}%'),
                BusModel.depot.ilike(f'%{s}%'),
                NotificationModel.title.ilike(f'%{s}%'),
                NotificationModel.message.ilike(f'%{s}%'),
                cast(BusAlertModel.bus_alert_id, String).ilike(f'%{s}%'),
                cast(BusAlertModel.bus_id, String).ilike(f'%{s}%'),
                cast(BusAlertModel.device_id, String).ilike(f'%{s}%')
            ]
            query = query.filter(or_(*search_conds))

        # 3. Bus ID Filter
        bus_id = filters.get('bus_id') or filters.get('busId')
        if bus_id and str(bus_id).strip().lower() not in ('all', 'all buses'):
            try:
                b_clean = int(str(bus_id).replace('BUS-', '').replace('Bus', '').strip())
                query = query.filter(BusAlertModel.bus_id == b_clean)
            except (ValueError, TypeError):
                pass

        # 4. Device ID Filter
        device_id = filters.get('device_id') or filters.get('deviceId')
        if device_id and str(device_id).strip().lower() not in ('all', 'all devices'):
            try:
                d_clean = int(str(device_id).replace('DEV-', '').replace('Device', '').strip())
                query = query.filter(BusAlertModel.device_id == d_clean)
            except (ValueError, TypeError):
                pass

        # 5. Date Range
        start_date = filters.get('start_date') or filters.get('startDate')
        if start_date:
            try:
                if isinstance(start_date, str):
                    sd = datetime.strptime(start_date.split('T')[0], '%Y-%m-%d')
                else:
                    sd = start_date
                query = query.filter(BusAlertModel.alert_time >= sd)
            except Exception:
                pass

        end_date = filters.get('end_date') or filters.get('endDate')
        if end_date:
            try:
                if isinstance(end_date, str):
                    ed = datetime.strptime(end_date.split('T')[0], '%Y-%m-%d').replace(hour=23, minute=59, second=59)
                else:
                    ed = end_date
                query = query.filter(BusAlertModel.alert_time <= ed)
            except Exception:
                pass

        return query

    def get_filtered(self, filters=None, page=None, per_page=None):
        query = self._build_base_query(filters)
        query = query.order_by(BusAlertModel.alert_time.desc(), BusAlertModel.bus_alert_id.desc())

        total = query.count()

        if page is not None and per_page is not None:
            page = max(1, int(page))
            per_page = max(1, int(per_page))
            offset = (page - 1) * per_page
            rows = query.offset(offset).limit(per_page).all()
            total_pages = (total + per_page - 1) // per_page if per_page > 0 else 1
            return {
                'items': rows,
                'total': total,
                'page': page,
                'per_page': per_page,
                'total_pages': total_pages
            }

        rows = query.all()
        return {
            'items': rows,
            'total': total,
            'page': 1,
            'per_page': total if total > 0 else 10,
            'total_pages': 1
        }

    def get_by_id(self, bus_alert_id):
        query = db.session.query(
            BusAlertModel,
            BusModel,
            NotificationModel,
            SensorDataModel
        ).outerjoin(
            BusModel, BusModel.bus_id == BusAlertModel.bus_id
        ).outerjoin(
            NotificationModel, NotificationModel.bus_alert_id == BusAlertModel.bus_alert_id
        ).outerjoin(
            SensorDataModel, SensorDataModel.sensor_data_id == BusAlertModel.sensor_data_id
        ).filter(
            BusAlertModel.bus_alert_id == bus_alert_id
        )
        return query.first()

    def get_summary(self):
        total = db.session.query(func.count(BusAlertModel.bus_alert_id)).scalar() or 0

        high = db.session.query(func.count(BusAlertModel.bus_alert_id)).outerjoin(
            NotificationModel, NotificationModel.bus_alert_id == BusAlertModel.bus_alert_id
        ).filter(func.coalesce(NotificationModel.priority, 'Medium').ilike('High')).scalar() or 0

        med = db.session.query(func.count(BusAlertModel.bus_alert_id)).outerjoin(
            NotificationModel, NotificationModel.bus_alert_id == BusAlertModel.bus_alert_id
        ).filter(func.coalesce(NotificationModel.priority, 'Medium').ilike('Medium')).scalar() or 0

        low = db.session.query(func.count(BusAlertModel.bus_alert_id)).outerjoin(
            NotificationModel, NotificationModel.bus_alert_id == BusAlertModel.bus_alert_id
        ).filter(func.coalesce(NotificationModel.priority, 'Medium').ilike('Low')).scalar() or 0

        # Today's alerts
        now = datetime.now(timezone.utc)
        today_start = datetime(now.year, now.month, now.day)
        today_alerts = db.session.query(func.count(BusAlertModel.bus_alert_id)).filter(
            BusAlertModel.alert_time >= today_start
        ).scalar() or 0

        return {
            'total': total,
            'totalAlerts': total,
            'high': high,
            'highAlerts': high,
            'medium': med,
            'mediumAlerts': med,
            'low': low,
            'lowAlerts': low,
            'today': today_alerts,
            'todayAlerts': today_alerts
        }

    def get_recent(self, limit=5):
        query = db.session.query(
            BusAlertModel,
            NotificationModel
        ).outerjoin(
            NotificationModel, NotificationModel.bus_alert_id == BusAlertModel.bus_alert_id
        ).order_by(
            BusAlertModel.alert_time.desc(), BusAlertModel.bus_alert_id.desc()
        ).limit(limit)

        return query.all()

    def get_charts_data(self):
        summary = self.get_summary()
        total = summary['total']

        # 1. Priority Distribution Data
        def calc_pct(val):
            if total == 0:
                return '0%'
            return f"{round((val / total) * 100)}%"

        priority_distribution = [
            {
                'name': 'High',
                'value': summary['high'],
                'percentage': calc_pct(summary['high']),
                'color': '#EF4444'
            },
            {
                'name': 'Medium',
                'value': summary['medium'],
                'percentage': calc_pct(summary['medium']),
                'color': '#4F46E5'
            },
            {
                'name': 'Low',
                'value': summary['low'],
                'percentage': calc_pct(summary['low']),
                'color': '#10B981'
            }
        ]

        # 2. Weekly Overview Data (Last 7 Days)
        weekly_overview = []
        now = datetime.now(timezone.utc)
        for i in range(6, -1, -1):
            target_day = now - timedelta(days=i)
            day_start = datetime(target_day.year, target_day.month, target_day.day, 0, 0, 0)
            day_end = datetime(target_day.year, target_day.month, target_day.day, 23, 59, 59)

            count = db.session.query(func.count(BusAlertModel.bus_alert_id)).filter(
                and_(
                    BusAlertModel.alert_time >= day_start,
                    BusAlertModel.alert_time <= day_end
                )
            ).scalar() or 0

            weekly_overview.append({
                'day': target_day.strftime('%a'),
                'label': target_day.strftime('%d %b'),
                'count': count
            })

        return {
            'priorityDistribution': priority_distribution,
            'weeklyOverview': weekly_overview,
            'totalWeeklyAlerts': sum(d['count'] for d in weekly_overview)
        }

    def get_alerts_for_export(self, filters=None):
        query = self._build_base_query(filters)
        query = query.order_by(BusAlertModel.alert_time.desc(), BusAlertModel.bus_alert_id.desc())
        return query.all()
