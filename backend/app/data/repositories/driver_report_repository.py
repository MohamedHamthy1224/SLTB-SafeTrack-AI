from app.data.database import db
from app.data.models.driver_model import DriverModel
from sqlalchemy import func

class DriverReportRepository:

    ALLOWED_SORT_FIELDS = {
        'driver_id': DriverModel.driver_id,
        'full_name': DriverModel.full_name,
        'date_of_birth': DriverModel.date_of_birth,
        'gender': DriverModel.gender,
        'nic': DriverModel.nic,
        'license_number': DriverModel.license_number,
        'experience_years': DriverModel.experience_years,
        'join_date': DriverModel.join_date,
        'status': DriverModel.status,
        'created_at': DriverModel.created_at
    }

    def get_summary(self):
        total = db.session.query(func.count(DriverModel.driver_id)).scalar() or 0
        active = db.session.query(func.count(DriverModel.driver_id)).filter(DriverModel.status == 'Active').scalar() or 0
        inactive = db.session.query(func.count(DriverModel.driver_id)).filter(DriverModel.status == 'Inactive').scalar() or 0

        return {
            'totalDrivers': total,
            'activeDrivers': active,
            'inactiveDrivers': inactive
        }

    def get_filter_options(self):
        genders = [r[0] for r in db.session.query(DriverModel.gender).distinct().all() if r[0]]
        statuses = ['Active', 'Inactive']
        exp_years = [r[0] for r in db.session.query(DriverModel.experience_years).distinct().all() if r[0] is not None]

        return {
            'genders': sorted(genders),
            'statuses': statuses,
            'experienceYears': sorted(exp_years)
        }

    def _build_filtered_query(self, filters):
        query = db.session.query(DriverModel)

        if not filters:
            return query

        gender = filters.get('gender')
        if gender and gender.lower() != 'all':
            query = query.filter(DriverModel.gender == gender)

        status = filters.get('status')
        if status and status.lower() != 'all':
            query = query.filter(DriverModel.status == status)

        exp_years = filters.get('experience_years')
        if exp_years and str(exp_years).lower() != 'all':
            try:
                query = query.filter(DriverModel.experience_years == int(exp_years))
            except (ValueError, TypeError):
                pass

        return query

    def get_report_data(self, criteria):
        query = self._build_filtered_query(criteria.filters)

        total_items = query.count()

        sort_attr = self.ALLOWED_SORT_FIELDS.get(criteria.sort_by, DriverModel.driver_id)
        if criteria.order == 'desc':
            query = query.order_by(sort_attr.desc())
        else:
            query = query.order_by(sort_attr.asc())

        items = query.offset(criteria.offset).limit(criteria.per_page).all()
        total_pages = (total_items + criteria.per_page - 1) // criteria.per_page if criteria.per_page > 0 else 1

        return {
            'items': [d.to_dict() for d in items],
            'pagination': {
                'page': criteria.page,
                'perPage': criteria.per_page,
                'totalItems': total_items,
                'totalPages': total_pages
            }
        }

    def get_all_filtered_for_export(self, filters, sort_by=None, order='asc'):
        query = self._build_filtered_query(filters)
        sort_attr = self.ALLOWED_SORT_FIELDS.get(sort_by, DriverModel.driver_id)
        if order == 'desc':
            query = query.order_by(sort_attr.desc())
        else:
            query = query.order_by(sort_attr.asc())
        return [d.to_dict() for d in query.all()]
