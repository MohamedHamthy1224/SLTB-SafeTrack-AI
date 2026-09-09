import csv
import io
from app.data.database import db, bcrypt
from app.data.repositories.user_repository import UserRepository
from app.data.repositories.role_repository import RoleRepository
from app.data.repositories.police_officer_repository import PoliceOfficerRepository
from app.data.repositories.sltb_user_repository import SLTBUserRepository
from app.business.exceptions.application_exceptions import ValidationError, ApplicationError
from datetime import datetime

ROLE_MAP = {
    'Police Admin': 1,
    'Traffic Police Officer': 2,
    'SLTB Admin': 3
}

class UserManagementService:

    def __init__(self, user_repo=None, role_repo=None, police_repo=None, sltb_repo=None):
        self.user_repo = user_repo or UserRepository()
        self.role_repo = role_repo or RoleRepository()
        self.police_repo = police_repo or PoliceOfficerRepository()
        self.sltb_repo = sltb_repo or SLTBUserRepository()

    def get_summary_stats(self):
        return self.user_repo.get_summary_stats()

    def get_users(self, params=None):
        params = params or {}
        search = params.get('search', '')
        role = params.get('role')
        status = params.get('status')
        page = params.get('page', 1)
        per_page = params.get('per_page', 50)
        sort_by = params.get('sort_by', 'user_id')
        order = params.get('order', 'asc')

        users, total_items = self.user_repo.get_filtered_users(
            search=search,
            role=role,
            status=status,
            page=page,
            per_page=per_page,
            sort_by=sort_by,
            order=order
        )

        user_dicts = [u.to_safe_dict() for u in users]
        return {
            'users': user_dicts,
            'total': total_items,
            'page': int(page) if page else 1,
            'per_page': int(per_page) if per_page else 50
        }

    def get_user_by_id(self, user_id):
        try:
            uid = int(user_id)
        except (ValueError, TypeError):
            raise ValidationError("Invalid user ID format.")

        user = self.user_repo.get_by_id(uid)
        if not user:
            raise ApplicationError("User not found.", status_code=404)

        return user.to_safe_dict()

    def create_user(self, data):
        data = data or {}
        errors = {}

        # 1. Validate required fields
        role_name = (data.get('role') or '').strip()
        username = (data.get('username') or '').strip()
        email = (data.get('email') or '').strip().lower()
        password = data.get('password') or ''
        full_name = (data.get('fullName') or data.get('full_name') or '').strip()

        if not role_name:
            errors['role'] = 'Select the user role'
        elif role_name not in ROLE_MAP:
            errors['role'] = 'Invalid user role selected'

        if not username:
            errors['username'] = 'Enter unique username'

        if not email:
            errors['email'] = 'Enter valid email address'
        elif '@' not in email or '.' not in email:
            errors['email'] = 'Enter valid email address'

        if not password:
            errors['password'] = 'Enter a strong password'

        if not full_name:
            errors['fullName'] = 'Enter full name'

        # Role specific validation
        badge_number = (data.get('badgeNumber') or data.get('badge_number') or '').strip()
        employee_id = (data.get('employeeId') or data.get('employee_id') or '').strip()

        if role_name == 'SLTB Admin':
            if not employee_id:
                errors['employeeId'] = 'Enter employee ID'
        elif role_name in ['Police Admin', 'Traffic Police Officer']:
            if not badge_number:
                errors['badgeNumber'] = 'Enter badge number'

        # Check for duplicates before hitting DB exception
        if username and self.user_repo.get_by_username(username):
            errors['username'] = 'Username is already taken'

        if email and self.user_repo.get_by_email(email):
            errors['email'] = 'Email address is already registered'

        if badge_number and self.police_repo.get_by_badge_number(badge_number):
            errors['badgeNumber'] = 'Badge number is already registered'

        if employee_id and self.sltb_repo.get_by_employee_id(employee_id):
            errors['employeeId'] = 'Employee ID is already registered'

        if errors:
            raise ValidationError("Validation failed. Please correct the errors.", errors=errors)

        # 2. Database Transaction
        role_id = ROLE_MAP[role_name]
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        status = data.get('status') or 'Active'
        theme_preference = (data.get('themePreference') or data.get('theme_preference') or 'light').lower()
        if theme_preference not in ['light', 'dark', 'system']:
            theme_preference = 'light'

        try:
            # Create user
            user = self.user_repo.create({
                'role_id': role_id,
                'username': username,
                'email': email,
                'password': password_hash,
                'status': status,
                'theme_preference': theme_preference,
                'profile_image': data.get('avatar') or data.get('profile_image')
            }, commit=False)

            db.session.flush() # get user.user_id

            # Create profile
            if role_name == 'SLTB Admin':
                self.sltb_repo.create({
                    'user_id': user.user_id,
                    'full_name': full_name,
                    'employee_id': employee_id,
                    'department': data.get('department'),
                    'designation': data.get('designation'),
                    'phone': data.get('phone'),
                    'joined_date': data.get('joinedDate') or data.get('joined_date')
                }, commit=False)
            else:
                is_online = False
                if 'isOnline' in data:
                    is_online = str(data['isOnline']).lower() in ['true', '1', 'online']
                self.police_repo.create({
                    'user_id': user.user_id,
                    'full_name': full_name,
                    'badge_number': badge_number,
                    'rank': data.get('rank'),
                    'police_station': data.get('policeStation') or data.get('department'),
                    'phone': data.get('phone'),
                    'joined_date': data.get('joinedDate') or data.get('joined_date'),
                    'device_token': data.get('deviceToken'),
                    'is_online': is_online
                }, commit=False)

            db.session.commit()
            return user.to_safe_dict()

        except Exception as e:
            db.session.rollback()
            raise ApplicationError(f"Failed to create user: {str(e)}", status_code=500)

    def update_user(self, user_id, data):
        try:
            uid = int(user_id)
        except (ValueError, TypeError):
            raise ValidationError("Invalid user ID format.")

        user = self.user_repo.get_by_id(uid)
        if not user:
            raise ApplicationError("User not found.", status_code=404)

        data = data or {}
        errors = {}

        username = (data.get('username') or '').strip()
        email = (data.get('email') or '').strip().lower()
        full_name = (data.get('fullName') or data.get('full_name') or '').strip()

        if username and self.user_repo.get_by_username(username, exclude_user_id=uid):
            errors['username'] = 'Username is already taken'

        if email and self.user_repo.get_by_email(email, exclude_user_id=uid):
            errors['email'] = 'Email address is already registered'

        role_name = user.role.role_name if user.role else ''
        badge_number = (data.get('badgeNumber') or data.get('badge_number') or '').strip()
        employee_id = (data.get('employeeId') or data.get('employee_id') or '').strip()

        if badge_number and self.police_repo.get_by_badge_number(badge_number, exclude_user_id=uid):
            errors['badgeNumber'] = 'Badge number is already registered'

        if employee_id and self.sltb_repo.get_by_employee_id(employee_id, exclude_user_id=uid):
            errors['employeeId'] = 'Employee ID is already registered'

        if errors:
            raise ValidationError("Validation failed.", errors=errors)

        try:
            # Update core user fields
            update_fields = {}
            if username:
                update_fields['username'] = username
            if email:
                update_fields['email'] = email
            if data.get('status'):
                update_fields['status'] = data['status']
            theme_val = data.get('themePreference') or data.get('theme_preference')
            if theme_val and isinstance(theme_val, str):
                pref = theme_val.lower()
                if pref in ['light', 'dark', 'system']:
                    update_fields['theme_preference'] = pref
            if data.get('password'):
                update_fields['password'] = bcrypt.generate_password_hash(data['password']).decode('utf-8')

            if update_fields:
                self.user_repo.update(uid, update_fields, commit=False)

            # Update profile
            if role_name == 'SLTB Admin':
                profile_fields = {}
                if full_name:
                    profile_fields['full_name'] = full_name
                if employee_id:
                    profile_fields['employee_id'] = employee_id
                if 'department' in data:
                    profile_fields['department'] = data['department']
                if 'designation' in data:
                    profile_fields['designation'] = data['designation']
                if 'phone' in data:
                    profile_fields['phone'] = data['phone']
                if 'joinedDate' in data or 'joined_date' in data:
                    profile_fields['joined_date'] = data.get('joinedDate') or data.get('joined_date')

                if profile_fields:
                    self.sltb_repo.update_profile(uid, profile_fields, commit=False)
            else:
                profile_fields = {}
                if full_name:
                    profile_fields['full_name'] = full_name
                if badge_number:
                    profile_fields['badge_number'] = badge_number
                if 'rank' in data:
                    profile_fields['rank'] = data['rank']
                if 'policeStation' in data or 'police_station' in data:
                    profile_fields['police_station'] = data.get('policeStation') or data.get('police_station')
                if 'phone' in data:
                    profile_fields['phone'] = data['phone']
                if 'joinedDate' in data or 'joined_date' in data:
                    profile_fields['joined_date'] = data.get('joinedDate') or data.get('joined_date')
                if 'deviceToken' in data:
                    profile_fields['device_token'] = data['deviceToken']
                if 'isOnline' in data:
                    profile_fields['is_online'] = str(data['isOnline']).lower() in ['true', '1', 'online']

                if profile_fields:
                    self.police_repo.update_profile(uid, profile_fields, commit=False)

            db.session.commit()
            updated_user = self.user_repo.get_by_id(uid)
            return updated_user.to_safe_dict() if updated_user else {}

        except Exception as e:
            db.session.rollback()
            raise ApplicationError(f"Failed to update user: {str(e)}", status_code=500)

    def delete_user(self, user_id):
        try:
            uid = int(user_id)
        except (ValueError, TypeError):
            raise ValidationError("Invalid user ID format.")

        user = self.user_repo.get_by_id(uid)
        if not user:
            raise ApplicationError("User not found.", status_code=404)

        try:
            # Delete linked profile first if any
            if user.police_profile:
                db.session.delete(user.police_profile)
            if user.sltb_profile:
                db.session.delete(user.sltb_profile)

            # Delete sessions & logs if necessary
            for s in user.sessions:
                db.session.delete(s)
            for l in user.activity_logs:
                db.session.delete(l)

            db.session.delete(user)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise ApplicationError(f"Failed to delete user: {str(e)}", status_code=500)

    def export_users_pdf(self, params=None, request_user_id=None):
        params = params or {}
        export_params = dict(params)
        export_params['page'] = 1
        export_params['per_page'] = 100000  # Full filtered dataset

        result = self.get_users(export_params)
        users = result['users']
        summary = self.get_summary_stats()

        cols = [
            {'header': 'User ID', 'key': 'userId', 'width': 8, 'align': 'left'},
            {'header': 'Username', 'key': 'username', 'width': 14, 'align': 'left'},
            {'header': 'Full Name', 'key': 'fullName', 'width': 18, 'align': 'left'},
            {'header': 'Email Address', 'key': 'email', 'width': 22, 'align': 'left'},
            {'header': 'Role', 'key': 'role', 'width': 16, 'align': 'left'},
            {'header': 'Phone', 'key': 'phone', 'width': 12, 'align': 'left'},
            {'header': 'Status', 'key': 'status', 'width': 8, 'align': 'left'},
        ]

        summary_metrics = {
            'Total Users': summary.get('totalUsers', 0),
            'Police Admin': summary.get('policeAdminUsers', 0),
            'Traffic Officers': summary.get('trafficPoliceOfficers', 0),
            'SLTB Admin': summary.get('sltbAdminUsers', 0)
        }

        filter_info = {
            'Search': params.get('search') or None,
            'Role': params.get('role') if params.get('role') not in ('all', 'All Roles', None) else None,
            'Status': params.get('status') if params.get('status') not in ('all', 'All Status', None) else None,
        }

        # Activity log
        if request_user_id:
            try:
                from app.data.repositories.activity_log_repository import ActivityLogRepository
                ActivityLogRepository().log_activity(request_user_id, "Exported User Management PDF report.")
            except Exception:
                pass

        from app.business.services.pdf_generator_service import PDFGeneratorService
        return PDFGeneratorService.generate_report_pdf(
            title="SLTB SAFETRACK AI - USER MANAGEMENT REPORT",
            columns=cols,
            rows=users,
            summary_metrics=summary_metrics,
            filter_info=filter_info,
            user_info=f"User #{request_user_id}" if request_user_id else "System Admin"
        )

    def export_users_csv(self, params=None):
        return self.export_users_pdf(params)

