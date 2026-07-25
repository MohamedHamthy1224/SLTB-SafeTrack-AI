import logging
from app.data.database import db
from app.domain.entities.route import Route
from app.domain.entities.route_filter import RouteFilter
from app.data.repositories.route_repository import RouteRepository
from app.data.repositories.assignment_repository import AssignmentRepository
from app.data.repositories.activity_log_repository import ActivityLogRepository
from app.business.validators.route_validator import RouteValidator
from app.business.validators.route_filter_validator import RouteFilterValidator
from app.business.strategies.linear_search_strategy import LinearSearchStrategy
from app.business.strategies.binary_search_strategy import BinarySearchStrategy
from app.business.strategies.merge_sort_strategy import MergeSortStrategy
from app.business.strategies.quick_sort_strategy import QuickSortStrategy
from app.business.services.websocket_service import WebSocketService
from sqlalchemy.exc import SQLAlchemyError

logger = logging.getLogger(__name__)

class RouteServiceError(Exception):
    def __init__(self, message="An error occurred in route operations.", errors=None, status_code=500):
        super().__init__(message)
        self.message = message
        self.errors = errors or {}
        self.status_code = status_code

class ResourceNotFoundError(RouteServiceError):
    def __init__(self, message="Route not found."):
        super().__init__(message=message, status_code=404)

class RouteAlreadyInactiveError(RouteServiceError):
    def __init__(self, message="This route is already inactive."):
        super().__init__(message=message, status_code=409)

class DuplicateResourceError(RouteServiceError):
    def __init__(self, message="This route number already exists.", errors=None):
        super().__init__(message=message, errors=errors or {'route_number': message}, status_code=409)

class RouteService:
    """
    RouteService encapsulating business logic for route calculation, management,
    DSA sorting/searching, and atomic database transaction processing.
    """

    def __init__(
        self,
        route_repo=None,
        assignment_repo=None,
        activity_repo=None,
        route_validator=None,
        filter_validator=None,
        linear_search_strategy=None,
        binary_search_strategy=None,
        merge_sort_strategy=None,
        quick_sort_strategy=None,
        websocket_service=None
    ):
        self.route_repo = route_repo or RouteRepository()
        self.assignment_repo = assignment_repo or AssignmentRepository()
        self.activity_repo = activity_repo or ActivityLogRepository()
        self.route_validator = route_validator or RouteValidator(self.route_repo)
        self.filter_validator = filter_validator or RouteFilterValidator()
        self.linear_search = linear_search_strategy or LinearSearchStrategy()
        self.binary_search = binary_search_strategy or BinarySearchStrategy()
        self.merge_sort = merge_sort_strategy or MergeSortStrategy()
        self.quick_sort = quick_sort_strategy or QuickSortStrategy()
        self.websocket_service = websocket_service or WebSocketService()

    def get_summary(self):
        """Fetch route metrics calculated dynamically from MySQL."""
        return self.route_repo.get_summary_metrics()

    def get_filter_options(self):
        """
        Fetch distinct start and end locations, sorted alphabetically using manual MergeSortStrategy.
        """
        raw_starts = self.route_repo.get_start_locations()
        raw_ends = self.route_repo.get_end_locations()

        # Merge sort start and end location options
        sorted_starts = self.merge_sort.sort(raw_starts, reverse=False)
        sorted_ends = self.merge_sort.sort(raw_ends, reverse=False)

        return {
            'startLocations': sorted_starts,
            'endLocations': sorted_ends,
            'statuses': ['Active', 'Inactive']
        }

    def get_status_options(self):
        """Return backend database-supported route status options."""
        return [
            {'value': 'Active', 'label': 'Active'},
            {'value': 'Inactive', 'label': 'Inactive'}
        ]

    def get_routes(self, params):
        """
        Retrieve candidate routes from database, filter by parameters,
        apply manual Linear Search for partial query matching,
        apply manual Quick Sort for table ordering, and return paginated data.
        """
        val_errors = self.filter_validator.validate(params)
        if val_errors:
            raise RouteServiceError("Invalid filter parameters.", errors=val_errors, status_code=400)

        route_filter = RouteFilter(
            search=params.get('search', ''),
            status=params.get('status', ''),
            start_location=params.get('start_location', ''),
            end_location=params.get('end_location', ''),
            page=params.get('page', 1),
            per_page=params.get('per_page', 10),
            sort_by=params.get('sort_by', 'route_number'),
            order=params.get('order', 'asc')
        )

        all_models = self.route_repo.get_all()

        # Wrap in Route domain entities and convert to dicts
        route_dicts = []
        for rm in all_models:
            entity = Route(
                route_id=rm.route_id,
                route_number=rm.route_number,
                route_name=rm.route_name,
                start_location=rm.start_location,
                end_location=rm.end_location,
                distance_km=rm.distance_km,
                estimated_duration=rm.estimated_duration,
                status=rm.status,
                created_at=rm.created_at
            )
            route_dicts.append(entity.to_dict())

        # Filtering by Status
        filtered = route_dicts
        if route_filter.status and route_filter.status.lower() not in ('all', 'all status', ''):
            filtered = [r for r in filtered if r['status'].lower() == route_filter.status.lower()]

        # Filtering by Start Location
        if route_filter.start_location and route_filter.start_location.lower() not in ('all', 'all locations', ''):
            filtered = [r for r in filtered if r['start_location'].lower() == route_filter.start_location.lower()]

        # Filtering by End Location
        if route_filter.end_location and route_filter.end_location.lower() not in ('all', 'all locations', ''):
            filtered = [r for r in filtered if r['end_location'].lower() == route_filter.end_location.lower()]

        # Manual Linear Search for search term across route_number and route_name
        if route_filter.search:
            search_query = route_filter.search
            num_matches = self.linear_search.search(filtered, search_query, key_field='route_number')
            name_matches = self.linear_search.search(filtered, search_query, key_field='route_name')
            
            # Combine unique matches preserving entity dictionary reference
            seen_ids = set()
            combined_matches = []
            for r in num_matches + name_matches:
                if r['route_id'] not in seen_ids:
                    seen_ids.add(r['route_id'])
                    combined_matches.append(r)
            filtered = combined_matches

        # Manual Quick Sort for route table sorting
        is_reverse = (route_filter.order == 'desc')
        sorted_routes = self.quick_sort.sort(filtered, key_field=route_filter.sort_by, reverse=is_reverse)

        # Pagination calculations
        total_items = len(sorted_routes)
        per_page = route_filter.per_page
        total_pages = (total_items + per_page - 1) // per_page if total_items > 0 else 1
        current_page = min(route_filter.page, total_pages) if total_pages > 0 else 1

        start_idx = (current_page - 1) * per_page
        end_idx = start_idx + per_page
        page_items = sorted_routes[start_idx:end_idx]

        return {
            'items': page_items,
            'pagination': {
                'page': current_page,
                'perPage': per_page,
                'totalItems': total_items,
                'totalPages': total_pages
            }
        }

    def get_route_details(self, route_id):
        """
        Retrieve route metadata and active assigned buses from MySQL.
        Uses eager joined loading in repository to avoid N+1 queries.
        """
        rm = self.route_repo.get_by_id(route_id)
        if not rm:
            raise ResourceNotFoundError("Route not found.")

        entity = Route(
            route_id=rm.route_id,
            route_number=rm.route_number,
            route_name=rm.route_name,
            start_location=rm.start_location,
            end_location=rm.end_location,
            distance_km=rm.distance_km,
            estimated_duration=rm.estimated_duration,
            status=rm.status,
            created_at=rm.created_at
        )

        route_data = entity.to_dict()

        # Fetch active assigned buses
        active_assignments = self.assignment_repo.get_active_by_route_id(route_id)
        assigned_buses = []
        for ass in active_assignments:
            if ass.bus:
                bus_dict = ass.bus.to_dict()
                assigned_buses.append({
                    'busId': bus_dict['bus_id'],
                    'busNumber': bus_dict['bus_number'],
                    'registrationNumber': bus_dict['registration_number'],
                    'depot': bus_dict.get('depot', 'N/A'),
                    'model': bus_dict.get('model', 'N/A'),
                    'capacity': bus_dict.get('capacity', 0),
                    'manufactureYear': bus_dict.get('manufacture_year', 'N/A'),
                    'status': bus_dict.get('status', 'Active'),
                    'createdAt': bus_dict.get('created_at')
                })

        route_data['assignedBuses'] = assigned_buses
        route_data['totalAssignedBuses'] = len(assigned_buses)

        return route_data

    def create_route(self, data, user_id):
        """
        Validate and insert a new route record inside a single database transaction.
        """
        errors = self.route_validator.validate(data, is_update=False)
        if errors:
            raise RouteServiceError("Validation failed.", errors=errors, status_code=400)

        try:
            # 1. Insert route
            new_route = self.route_repo.create(data, commit=False)
            db.session.flush()

            # 2. Create activity log
            activity_msg = f"Registered new route {new_route.route_number} ({new_route.route_name})."
            self.activity_repo.create({'user_id': user_id, 'activity': activity_msg}, commit=False)

            # 3. Commit transaction
            db.session.commit()

            entity = Route(
                route_id=new_route.route_id,
                route_number=new_route.route_number,
                route_name=new_route.route_name,
                start_location=new_route.start_location,
                end_location=new_route.end_location,
                distance_km=new_route.distance_km,
                estimated_duration=new_route.estimated_duration,
                status=new_route.status,
                created_at=new_route.created_at
            )
            result_dict = entity.to_dict()

            # 4. WebSockets emission
            self.websocket_service.emit_route_registered(result_dict)
            self.websocket_service.emit_route_summary_updated(self.get_summary())
            self.websocket_service.emit_recent_activity_created({'user_id': user_id, 'activity': activity_msg})

            return result_dict

        except SQLAlchemyError as error:
            db.session.rollback()
            logger.exception("Failed to insert new route record.")
            raise RouteServiceError("Database transaction failed while creating route.", status_code=500) from error

    def update_route(self, route_id, data, user_id):
        """
        Validate and update an existing route record inside a single transaction.
        """
        existing = self.route_repo.get_by_id(route_id)
        if not existing:
            raise ResourceNotFoundError("Route not found.")

        errors = self.route_validator.validate(data, is_update=True, current_route_id=route_id)
        if errors:
            raise RouteServiceError("Validation failed.", errors=errors, status_code=400)

        try:
            # Update fields
            updated = self.route_repo.update(route_id, data, commit=False)
            if not updated:
                raise ResourceNotFoundError("Route not found.")
            
            activity_msg = f"Updated route {updated.route_number} ({updated.route_name})."
            self.activity_repo.create({'user_id': user_id, 'activity': activity_msg}, commit=False)

            db.session.commit()

            entity = Route(
                route_id=updated.route_id,
                route_number=updated.route_number,
                route_name=updated.route_name,
                start_location=updated.start_location,
                end_location=updated.end_location,
                distance_km=updated.distance_km,
                estimated_duration=updated.estimated_duration,
                status=updated.status,
                created_at=updated.created_at
            )
            result_dict = entity.to_dict()

            self.websocket_service.emit_route_updated(result_dict)
            self.websocket_service.emit_route_summary_updated(self.get_summary())
            self.websocket_service.emit_recent_activity_created({'user_id': user_id, 'activity': activity_msg})

            return result_dict

        except SQLAlchemyError as error:
            db.session.rollback()
            logger.exception("Failed to update route record.")
            raise RouteServiceError("Database transaction failed while updating route.", status_code=500) from error

    def deactivate_route(self, route_id, user_id):
        """
        Safely deactivate a route:
        - Updates routes.status to 'Inactive'
        - Updates associated active bus_assignments.status to 'Cancelled'
        - Logs activity in single database transaction
        - Idempotent: returns 409 if already Inactive
        """
        route = self.route_repo.get_by_id(route_id)
        if not route:
            raise ResourceNotFoundError("Route not found.")

        if route.status == "Inactive":
            raise RouteAlreadyInactiveError("This route is already inactive.")

        previous_status = route.status

        try:
            # 1. Update route status to Inactive
            self.route_repo.update_status(route_id, "Inactive", commit=False)

            # 2. Fetch and cancel active bus assignments
            active_assignments = self.assignment_repo.get_active_by_route_id(route_id)
            cancelled_count = 0
            for assignment in active_assignments:
                self.assignment_repo.update_status(assignment.assignment_id, "Cancelled", commit=False)
                cancelled_count += 1

            # 3. Log user activity
            activity_msg = f"Route {route.route_number} was deactivated. Status changed from {previous_status} to Inactive."
            self.activity_repo.create({'user_id': user_id, 'activity': activity_msg}, commit=False)

            # 4. Commit atomic transaction
            db.session.commit()

            deactivate_data = {
                'routeId': route.route_id,
                'routeNumber': route.route_number,
                'previousStatus': previous_status,
                'currentStatus': 'Inactive',
                'cancelledAssignments': cancelled_count
            }

            # 5. Emit WebSockets
            self.websocket_service.emit_route_deactivated(deactivate_data)
            self.websocket_service.emit_route_summary_updated(self.get_summary())
            if cancelled_count > 0:
                self.websocket_service.emit_bus_assignment_updated({'routeId': route_id, 'cancelledAssignments': cancelled_count})
            self.websocket_service.emit_recent_activity_created({'user_id': user_id, 'activity': activity_msg})

            return deactivate_data

        except SQLAlchemyError as error:
            db.session.rollback()
            logger.exception("Failed to deactivate route record.")
            raise RouteServiceError("The selected route could not be deactivated at the moment.", status_code=500) from error
