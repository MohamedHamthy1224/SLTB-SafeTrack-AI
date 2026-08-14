from app.data.database import db
from app.data.models.bus_model import BusModel
from sqlalchemy import func

class BusReportRepository:

    ALLOWED_SORT_FIELDS = {
        'bus_id': BusModel.bus_id,
        'registration_number': BusModel.registration_number,
        'bus_number': BusModel.bus_number,
        'service_type': BusModel.service_type,
        'depot': BusModel.depot,
        'model': BusModel.model,
        'chassis_number': BusModel.chassis_number,
        'engine_number': BusModel.engine_number,
        'capacity': BusModel.capacity,
        'standing_capacity': BusModel.standing_capacity,
        'fuel_type': BusModel.fuel_type,
        'manufacture_year': BusModel.manufacture_year,
        'status': BusModel.status,
        'created_at': BusModel.created_at
    }

    def get_summary(self):
        total = db.session.query(func.count(BusModel.bus_id)).scalar() or 0
        active = db.session.query(func.count(BusModel.bus_id)).filter(BusModel.status == 'Active').scalar() or 0
        maintenance = db.session.query(func.count(BusModel.bus_id)).filter(BusModel.status == 'Maintenance').scalar() or 0
        inactive = db.session.query(func.count(BusModel.bus_id)).filter(BusModel.status == 'Inactive').scalar() or 0

        return {
            'totalBuses': total,
            'activeBuses': active,
            'maintenanceBuses': maintenance,
            'inactiveBuses': inactive
        }

    def get_filter_options(self):
        service_types = [r[0] for r in db.session.query(BusModel.service_type).distinct().all() if r[0]]
        depots = [r[0] for r in db.session.query(BusModel.depot).distinct().all() if r[0]]
        statuses = ['Active', 'Maintenance', 'Inactive']

        return {
            'serviceTypes': sorted(service_types),
            'depots': sorted(depots),
            'statuses': statuses
        }

    def _build_filtered_query(self, filters):
        query = db.session.query(BusModel)

        if not filters:
            return query

        service_type = filters.get('service_type')
        if service_type and str(service_type).lower() != 'all':
            query = query.filter(BusModel.service_type == service_type)

        depot = filters.get('depot')
        if depot and str(depot).lower() != 'all':
            query = query.filter(BusModel.depot == depot)

        status = filters.get('status')
        if status and str(status).lower() != 'all':
            query = query.filter(BusModel.status == status)

        return query

    def get_report_data(self, criteria):
        query = self._build_filtered_query(criteria.filters)

        total_items = query.count()

        # Sorting
        sort_field = criteria.sort_by if criteria.sort_by in self.ALLOWED_SORT_FIELDS else 'bus_id'
        sort_attr = self.ALLOWED_SORT_FIELDS[sort_field]
        if criteria.order == 'desc':
            query = query.order_by(sort_attr.desc())
        else:
            query = query.order_by(sort_attr.asc())

        items = query.offset(criteria.offset).limit(criteria.per_page).all()
        total_pages = (total_items + criteria.per_page - 1) // criteria.per_page if criteria.per_page > 0 else 1

        return {
            'items': [b.to_dict() for b in items],
            'pagination': {
                'page': criteria.page,
                'perPage': criteria.per_page,
                'totalItems': total_items,
                'totalPages': total_pages
            }
        }

    def get_all_filtered_for_export(self, filters, sort_by=None, order='asc'):
        query = self._build_filtered_query(filters)
        sort_field = sort_by if sort_by in self.ALLOWED_SORT_FIELDS else 'bus_id'
        sort_attr = self.ALLOWED_SORT_FIELDS[sort_field]
        if order == 'desc':
            query = query.order_by(sort_attr.desc())
        else:
            query = query.order_by(sort_attr.asc())
        return [b.to_dict() for b in query.all()]
