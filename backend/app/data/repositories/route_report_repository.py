from app.data.database import db
from app.data.models.route_model import RouteModel
from sqlalchemy import func

class RouteReportRepository:

    ALLOWED_SORT_FIELDS = {
        'route_id': RouteModel.route_id,
        'route_number': RouteModel.route_number,
        'route_name': RouteModel.route_name,
        'start_location': RouteModel.start_location,
        'end_location': RouteModel.end_location,
        'distance_km': RouteModel.distance_km,
        'estimated_duration': RouteModel.estimated_duration,
        'status': RouteModel.status,
        'created_at': RouteModel.created_at
    }

    def get_summary(self):
        total = db.session.query(func.count(RouteModel.route_id)).scalar() or 0
        active = db.session.query(func.count(RouteModel.route_id)).filter(RouteModel.status == 'Active').scalar() or 0
        inactive = db.session.query(func.count(RouteModel.route_id)).filter(RouteModel.status == 'Inactive').scalar() or 0
        total_distance = db.session.query(func.sum(RouteModel.distance_km)).scalar() or 0.0

        return {
            'totalRoutes': total,
            'activeRoutes': active,
            'inactiveRoutes': inactive,
            'totalDistanceKm': float(round(total_distance, 2))
        }

    def get_filter_options(self):
        return {
            'statuses': ['Active', 'Inactive']
        }

    def _build_filtered_query(self, filters):
        query = db.session.query(RouteModel)

        if not filters:
            return query

        status = filters.get('status')
        if status and status.lower() not in ('all', 'all statuses'):
            query = query.filter(RouteModel.status == status)

        return query

    def get_report_data(self, criteria):
        query = self._build_filtered_query(criteria.filters)

        total_items = query.count()

        sort_attr = self.ALLOWED_SORT_FIELDS.get(criteria.sort_by, RouteModel.route_id)
        if criteria.order == 'desc':
            query = query.order_by(sort_attr.desc())
        else:
            query = query.order_by(sort_attr.asc())

        items = query.offset(criteria.offset).limit(criteria.per_page).all()
        total_pages = (total_items + criteria.per_page - 1) // criteria.per_page if criteria.per_page > 0 else 1

        return {
            'items': [r.to_dict() for r in items],
            'pagination': {
                'page': criteria.page,
                'perPage': criteria.per_page,
                'totalItems': total_items,
                'totalPages': total_pages
            }
        }

    def get_all_filtered_for_export(self, filters, sort_by=None, order='asc'):
        query = self._build_filtered_query(filters)
        sort_attr = self.ALLOWED_SORT_FIELDS.get(sort_by, RouteModel.route_id)
        if order == 'desc':
            query = query.order_by(sort_attr.desc())
        else:
            query = query.order_by(sort_attr.asc())
        return [r.to_dict() for r in query.all()]
