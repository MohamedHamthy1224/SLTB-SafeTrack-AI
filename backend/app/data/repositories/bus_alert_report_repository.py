from app.data.database import db
from app.data.models.bus_alert_model import BusAlertModel
from sqlalchemy import func

class BusAlertReportRepository:

    ALLOWED_SORT_FIELDS = {
        'bus_alert_id': BusAlertModel.bus_alert_id,
        'bus_id': BusAlertModel.bus_id,
        'device_id': BusAlertModel.device_id,
        'assignment_id': BusAlertModel.assignment_id,
        'sensor_data_id': BusAlertModel.sensor_data_id,
        'alert_time': BusAlertModel.alert_time
    }

    def get_summary(self):
        total = db.session.query(func.count(BusAlertModel.bus_alert_id)).scalar() or 0
        return {
            'totalAlerts': total
        }

    def get_filter_options(self):
        bus_ids = [r[0] for r in db.session.query(BusAlertModel.bus_id).distinct().all() if r[0] is not None]
        return {
            'busIds': sorted(bus_ids)
        }

    def _build_filtered_query(self, filters):
        query = db.session.query(BusAlertModel)

        if not filters:
            return query

        bus_id = filters.get('bus_id')
        if bus_id and str(bus_id).lower() != 'all':
            try:
                # Handle both integer bus_id or "BUS-0001" formatted string
                clean_id = str(bus_id).upper().replace('BUS-', '')
                query = query.filter(BusAlertModel.bus_id == int(clean_id))
            except (ValueError, TypeError):
                pass

        return query

    def get_report_data(self, criteria):
        query = self._build_filtered_query(criteria.filters)

        total_items = query.count()

        sort_attr = self.ALLOWED_SORT_FIELDS.get(criteria.sort_by, BusAlertModel.bus_alert_id)
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
        sort_attr = self.ALLOWED_SORT_FIELDS.get(sort_by, BusAlertModel.bus_alert_id)
        if order == 'desc':
            query = query.order_by(sort_attr.desc())
        else:
            query = query.order_by(sort_attr.asc())
        return [a.to_dict() for a in query.all()]
