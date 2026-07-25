from app.data.database import db
from app.data.models.route_model import RouteModel
from app.data.repositories.base_repository import BaseRepository
from sqlalchemy import func

class RouteRepository(BaseRepository):
    """
    RouteRepository implementing data access for routes table.
    Inherits from BaseRepository and overrides core CRUD methods.
    """

    def get_by_id(self, entity_id):
        return db.session.query(RouteModel).filter(RouteModel.route_id == entity_id).first()

    def get_all(self):
        return db.session.query(RouteModel).all()

    def get_all_models(self):
        """Return all RouteModel ORM instances for direct attribute access by the service layer."""
        return db.session.query(RouteModel).all()

    def get_by_route_number(self, route_number):
        if not route_number:
            return None
        return db.session.query(RouteModel).filter(
            func.lower(RouteModel.route_number) == str(route_number).strip().lower()
        ).first()

    def create(self, data, commit=True):
        route = RouteModel(
            route_number=data.get('route_number'),
            route_name=data.get('route_name'),
            start_location=data.get('start_location'),
            end_location=data.get('end_location'),
            distance_km=data.get('distance_km'),
            estimated_duration=data.get('estimated_duration'),
            status=data.get('status', 'Active')
        )
        db.session.add(route)
        if commit:
            db.session.commit()
        return route

    def update(self, entity_id, data, commit=True):
        route = self.get_by_id(entity_id)
        if not route:
            return None

        if 'route_number' in data:
            route.route_number = data['route_number']
        if 'route_name' in data:
            route.route_name = data['route_name']
        if 'start_location' in data:
            route.start_location = data['start_location']
        if 'end_location' in data:
            route.end_location = data['end_location']
        if 'distance_km' in data:
            route.distance_km = data['distance_km']
        if 'estimated_duration' in data:
            route.estimated_duration = data['estimated_duration']
        if 'status' in data:
            route.status = data['status']

        if commit:
            db.session.commit()
        return route

    def update_status(self, route_id, status, commit=True):
        route = self.get_by_id(route_id)
        if not route:
            return None
        route.status = status
        if commit:
            db.session.commit()
        return route

    def delete(self, entity_id, commit=True):
        route = self.get_by_id(entity_id)
        if route:
            db.session.delete(route)
            if commit:
                db.session.commit()
            return True
        return False

    def get_active_routes(self):
        return db.session.query(RouteModel).filter(RouteModel.status == 'Active').all()

    def get_start_locations(self):
        """Fetch distinct non-null start locations from routes table."""
        results = db.session.query(RouteModel.start_location).filter(
            RouteModel.start_location.isnot(None),
            RouteModel.start_location != ''
        ).distinct().all()
        return [r[0] for r in results if r[0]]

    def get_end_locations(self):
        """Fetch distinct non-null end locations from routes table."""
        results = db.session.query(RouteModel.end_location).filter(
            RouteModel.end_location.isnot(None),
            RouteModel.end_location != ''
        ).distinct().all()
        return [r[0] for r in results if r[0]]

    def get_summary_metrics(self):
        """
        Calculate totalRoutes, activeRoutes, inactiveRoutes, totalDistanceKm from MySQL.
        """
        total_routes = db.session.query(func.count(RouteModel.route_id)).scalar() or 0
        active_routes = db.session.query(func.count(RouteModel.route_id)).filter(RouteModel.status == 'Active').scalar() or 0
        inactive_routes = db.session.query(func.count(RouteModel.route_id)).filter(RouteModel.status == 'Inactive').scalar() or 0
        
        sum_distance = db.session.query(func.sum(RouteModel.distance_km)).scalar()
        total_distance = float(sum_distance) if sum_distance is not None else 0.0

        active_pct = (active_routes / total_routes * 100.0) if total_routes > 0 else 0.0
        inactive_pct = (inactive_routes / total_routes * 100.0) if total_routes > 0 else 0.0

        return {
            'totalRoutes': total_routes,
            'activeRoutes': active_routes,
            'inactiveRoutes': inactive_routes,
            'activePercentage': round(active_pct, 2),
            'inactivePercentage': round(inactive_pct, 2),
            'totalDistanceKm': round(total_distance, 2)
        }
