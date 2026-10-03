from app.data.database import db
from app.data.models.bus_assignment_history_model import BusAssignmentHistoryModel
from sqlalchemy import func

class AssignmentHistoryReportRepository:

    ALLOWED_SORT_FIELDS = {
        'assignment_history_id': BusAssignmentHistoryModel.assignment_history_id,
        'bus_id': BusAssignmentHistoryModel.bus_id,
        'driver_id': BusAssignmentHistoryModel.driver_id,
        'route_id': BusAssignmentHistoryModel.route_id,
        'start_datetime': BusAssignmentHistoryModel.start_datetime,
        'end_datetime': BusAssignmentHistoryModel.end_datetime,
        'assigned_by': BusAssignmentHistoryModel.assigned_by
    }

    def get_summary(self):
        total = db.session.query(func.count(BusAssignmentHistoryModel.assignment_history_id)).scalar() or 0
        ongoing = db.session.query(func.count(BusAssignmentHistoryModel.assignment_history_id))\
            .filter(BusAssignmentHistoryModel.end_datetime.is_(None)).scalar() or 0

        return {
            'totalAssignments': total,
            'activeAssignments': ongoing
        }

    def _build_filtered_query(self, filters):
        query = db.session.query(BusAssignmentHistoryModel)

        if not filters:
            return query

        bus_id = filters.get('bus_id')
        if bus_id and str(bus_id).lower() != 'all':
            try:
                query = query.filter(BusAssignmentHistoryModel.bus_id == int(bus_id))
            except (ValueError, TypeError):
                pass

        driver_id = filters.get('driver_id')
        if driver_id and str(driver_id).lower() != 'all':
            try:
                query = query.filter(BusAssignmentHistoryModel.driver_id == int(driver_id))
            except (ValueError, TypeError):
                pass

        route_id = filters.get('route_id')
        if route_id and str(route_id).lower() != 'all':
            try:
                query = query.filter(BusAssignmentHistoryModel.route_id == int(route_id))
            except (ValueError, TypeError):
                pass

        return query

    def get_report_data(self, criteria):
        query = self._build_filtered_query(criteria.filters)

        total_items = query.count()

        sort_attr = self.ALLOWED_SORT_FIELDS.get(criteria.sort_by, BusAssignmentHistoryModel.assignment_history_id)
        if criteria.order == 'desc':
            query = query.order_by(sort_attr.desc())
        else:
            query = query.order_by(sort_attr.asc())

        items = query.offset(criteria.offset).limit(criteria.per_page).all()
        total_pages = (total_items + criteria.per_page - 1) // criteria.per_page if criteria.per_page > 0 else 1

        return {
            'items': [a.to_dict() for a in items],
            'pagination': {
                'page': criteria.page,
                'perPage': criteria.per_page,
                'totalItems': total_items,
                'totalPages': total_pages
            }
        }

    def get_all_filtered_for_export(self, filters, sort_by=None, order='asc'):
        query = self._build_filtered_query(filters)
        sort_attr = self.ALLOWED_SORT_FIELDS.get(sort_by or '', BusAssignmentHistoryModel.assignment_history_id)
        if order == 'desc':
            query = query.order_by(sort_attr.desc())
        else:
            query = query.order_by(sort_attr.asc())
        return [a.to_dict() for a in query.all()]
