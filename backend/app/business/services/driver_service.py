import os
import uuid
from datetime import datetime, date, timezone
from werkzeug.utils import secure_filename
from sqlalchemy.exc import SQLAlchemyError

from app.data.database import db
from app.data.repositories.driver_repository import DriverRepository
from app.data.repositories.bus_repository import BusRepository
from app.data.repositories.route_repository import RouteRepository
from app.data.repositories.assignment_repository import AssignmentRepository
from app.data.repositories.activity_log_repository import ActivityLogRepository
from app.business.validators.driver_validator import DriverValidator, DriverFilterValidator, DriverAssignmentValidator
from app.business.strategies.linear_search_strategy import LinearSearchStrategy
from app.business.strategies.binary_search_strategy import BinarySearchStrategy
from app.business.strategies.quick_sort_strategy import QuickSortStrategy
from app.business.strategies.merge_sort_strategy import MergeSortStrategy
from app.business.services.websocket_service import WebSocketService

class DriverServiceError(Exception):
    def __init__(self, message, errors=None, status_code=400):
        super().__init__(message)
        self.message = message
        self.errors = errors or {}
        self.status_code = status_code


class DriverService:
    ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp'}
    MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB

    def __init__(self):
        self.driver_repo = DriverRepository()
        self.bus_repo = BusRepository()
        self.route_repo = RouteRepository()
        self.assignment_repo = AssignmentRepository()
        self.activity_repo = ActivityLogRepository()
        self.driver_validator = DriverValidator()
        self.filter_validator = DriverFilterValidator()
        self.assignment_validator = DriverAssignmentValidator()
        self.linear_search_strategy = LinearSearchStrategy()
        self.binary_search_strategy = BinarySearchStrategy()
        self.quick_sort_strategy = QuickSortStrategy()
        self.merge_sort_strategy = MergeSortStrategy()
        self.websocket_service = WebSocketService()

    def get_summary(self):
        return self.driver_repo.get_summary()

    def get_filter_options(self):
        statuses = [{"value": "All Status", "label": "All Status"}, {"value": "Active", "label": "Active"}, {"value": "Inactive", "label": "Inactive"}]
        genders = [{"value": "All Gender", "label": "All Gender"}, {"value": "Male", "label": "Male"}, {"value": "Female", "label": "Female"}]
        return {"statuses": statuses, "genders": genders}

    def get_status_options(self):
        return [
            {"value": "Active", "label": "Active"},
            {"value": "Inactive", "label": "Inactive"}
        ]

    def _allowed_file(self, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in self.ALLOWED_EXTENSIONS

    def save_profile_picture(self, file):
        if not file or not file.filename:
            return None

        filename = file.filename
        if not self._allowed_file(filename):
            raise DriverServiceError("Invalid image format. Allowed formats: JPG, JPEG, PNG, WEBP.", status_code=400)

        file.seek(0, os.SEEK_END)
        file_length = file.tell()
        file.seek(0)

        if file_length > self.MAX_FILE_SIZE:
            raise DriverServiceError("Image file size exceeds maximum limit of 2MB.", status_code=400)

        ext = filename.rsplit('.', 1)[1].lower()
        unique_name = f"driver_{uuid.uuid4().hex}_{int(datetime.now(timezone.utc).timestamp())}.{ext}"
        
        # Absolute path inside backend/app/static/uploads/drivers
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        upload_dir = os.path.join(base_dir, 'static', 'uploads', 'drivers')
        os.makedirs(upload_dir, exist_ok=True)

        full_path = os.path.join(upload_dir, unique_name)
        file.save(full_path)
        
        # Return relative path stored in DB
        return f"uploads/drivers/{unique_name}"

    def remove_profile_picture_file(self, relative_path):
        if not relative_path or not relative_path.startswith("uploads/drivers/"):
            return
        try:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            full_path = os.path.join(base_dir, 'static', relative_path)
            if os.path.exists(full_path):
                os.remove(full_path)
        except Exception:
            pass

    def get_drivers(self, params):
        val_errors = self.filter_validator.validate(params)
        if val_errors:
            raise DriverServiceError("Invalid filter parameters.", errors=val_errors, status_code=400)

        search_query = str(params.get('search', '')).strip()
        status_filter = params.get('status')
        gender_filter = params.get('gender')
        page = int(params.get('page', 1))
        per_page = int(params.get('per_page', 10))
        sort_by = params.get('sort_by', 'driver_id')
        order = params.get('order', 'asc')

        # Retrieve candidate models from database
        models = self.driver_repo.get_all_models()

        # Filtering by status and gender
        if status_filter and status_filter != 'All Status':
            models = [m for m in models if m.status == status_filter]
        if gender_filter and gender_filter != 'All Gender':
            models = [m for m in models if m.gender == gender_filter]

        # Convert to domain entities for algorithm operations
        entities = [self.driver_repo._model_to_entity(m) for m in models]

        # Apply searching strategy if query provided
        if search_query:
            if search_query.isdigit():
                # Binary Search for exact ID if sorted by driver_id
                entities = self.merge_sort_strategy.sort(entities, key_field='driver_id', reverse=False)
                exact_id = int(search_query)
                found = self.binary_search_strategy.search(entities, query=str(exact_id), key_field='driver_id')
                entities = [found[0]] if found else []
            else:
                # Linear Search across full_name, license_number, nic, phone, email_address
                results = {}
                for key_field in ['full_name', 'license_number', 'nic', 'phone', 'email_address']:
                    matches = self.linear_search_strategy.search(entities, query=search_query, key_field=key_field)
                    for m in matches:
                        results[m.driver_id] = m
                entities = list(results.values())

        # Apply QuickSort algorithm for table ordering
        sort_key_map = {
            'driver_id': 'driver_id',
            'full_name': 'full_name',
            'license_number': 'license_number',
            'nic': 'nic',
            'phone': 'phone',
            'email_address': 'email_address',
            'experience_years': 'experience_years',
            'gender': 'gender',
            'status': 'status',
            'join_date': 'join_date'
        }
        target_sort_key = sort_key_map.get(sort_by, 'driver_id')
        entities = self.quick_sort_strategy.sort(entities, key_field=target_sort_key, reverse=(order == 'desc'))

        # Pagination calculations
        total_items = len(entities)
        total_pages = (total_items + per_page - 1) // per_page if total_items > 0 else 1
        if page > total_pages:
            page = total_pages if total_pages > 0 else 1

        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        paged_entities = entities[start_idx:end_idx]

        items_dict = [e.to_dict() for e in paged_entities]

        return {
            "items": items_dict,
            "pagination": {
                "page": page,
                "perPage": per_page,
                "totalItems": total_items,
                "totalPages": total_pages
            }
        }

    def get_driver_details(self, driver_id):
        driver_model = self.driver_repo.get_by_id(driver_id)
        if not driver_model:
            raise DriverServiceError("Driver not found.", status_code=404)

        driver_entity = self.driver_repo._model_to_entity(driver_model)
        data = driver_entity.to_dict()

        # Fetch active bus assignment details if present
        active_assignment = self.assignment_repo.get_active_by_driver_id(driver_id)
        if active_assignment:
            bus = self.bus_repo.get_by_id(active_assignment.bus_id)
            route = self.route_repo.get_by_id(active_assignment.route_id)
            data["assignment"] = {
                "assignment_id": active_assignment.assignment_id,
                "bus_id": active_assignment.bus_id,
                "bus_number": bus.bus_number if bus else None,
                "registration_number": bus.registration_number if bus else None,
                "route_id": active_assignment.route_id,
                "route_number": route.route_number if route else None,
                "route_name": route.route_name if route else None,
                "assigned_date": str(active_assignment.assigned_date) if active_assignment.assigned_date else None,
                "status": active_assignment.status
            }
        else:
            data["assignment"] = None

        return data

    def get_assignment_options(self, driver_id):
        driver_model = self.driver_repo.get_by_id(driver_id)
        if not driver_model:
            raise DriverServiceError("Driver not found.", status_code=404)

        current_assignment = self.assignment_repo.get_active_by_driver_id(driver_id)
        current_bus_id = current_assignment.bus_id if current_assignment else None
        current_route_id = current_assignment.route_id if current_assignment else None

        # Fetch active buses eligible for assignment
        all_buses = self.bus_repo.get_all_models()
        eligible_buses = []
        for b in all_buses:
            if b.status != 'Active':
                continue
            is_used = self.assignment_repo.is_bus_assigned_active(b.bus_id, exclude_driver_id=driver_id)
            if not is_used or b.bus_id == current_bus_id:
                eligible_buses.append({
                    "bus_id": b.bus_id,
                    "bus_number": b.bus_number,
                    "registration_number": b.registration_number,
                    "status": b.status,
                    "is_available": not is_used or b.bus_id == current_bus_id,
                    "busId": b.bus_id,
                    "busNumber": b.bus_number,
                    "registrationNumber": b.registration_number,
                    "isAvailable": not is_used or b.bus_id == current_bus_id
                })

        # Fetch active routes eligible for assignment
        all_routes = self.route_repo.get_all_models()
        eligible_routes = []
        for r in all_routes:
            if r.status == 'Active':
                eligible_routes.append({
                    "route_id": r.route_id,
                    "route_number": r.route_number,
                    "route_name": r.route_name,
                    "status": r.status,
                    "routeId": r.route_id,
                    "routeNumber": r.route_number,
                    "routeName": r.route_name
                })

        # Apply MergeSort to options
        eligible_buses = self.merge_sort_strategy.sort(eligible_buses, key_field='bus_number', reverse=False)
        eligible_routes = self.merge_sort_strategy.sort(eligible_routes, key_field='route_number', reverse=False)

        curr_assignment_dict = None
        if current_assignment:
            curr_assignment_dict = {
                "assignment_id": current_assignment.assignment_id,
                "bus_id": current_assignment.bus_id,
                "route_id": current_assignment.route_id,
                "status": current_assignment.status,
                "assignmentId": current_assignment.assignment_id,
                "busId": current_assignment.bus_id,
                "routeId": current_assignment.route_id
            }

        return {
            "currentAssignment": curr_assignment_dict,
            "buses": eligible_buses,
            "routes": eligible_routes
        }

    def create_driver(self, driver_data, image_file=None, user_id=None):
        val_errors = self.driver_validator.validate(driver_data)
        if val_errors:
            raise DriverServiceError("Validation failed.", errors=val_errors, status_code=400)

        # Uniqueness checks
        license_no = str(driver_data.get('license_number')).strip()
        if self.driver_repo.get_by_license(license_no):
            raise DriverServiceError("Validation failed.", errors={"license_number": "This licence number already exists."}, status_code=400)

        nic = str(driver_data.get('nic')).strip() if driver_data.get('nic') else None
        if nic and self.driver_repo.get_by_nic(nic):
            raise DriverServiceError("Validation failed.", errors={"nic": "This NIC number already exists."}, status_code=400)

        email = str(driver_data.get('email_address')).strip() if driver_data.get('email_address') else None
        if email and self.driver_repo.get_by_email(email):
            raise DriverServiceError("Validation failed.", errors={"email_address": "This email address already exists."}, status_code=400)

        saved_photo_path = None
        if image_file:
            saved_photo_path = self.save_profile_picture(image_file)
            driver_data['profile_picture'] = saved_photo_path

        try:
            new_driver_model = self.driver_repo.create(driver_data, commit=False)
            db.session.flush()

            # Activity logging in same transaction
            if user_id:
                self.activity_repo.create({
                    "user_id": user_id,
                    "activity": f"Registered new driver '{new_driver_model.full_name}' (ID: {new_driver_model.driver_id})."
                }, commit=False)

            db.session.commit()

            driver_entity = self.driver_repo._model_to_entity(new_driver_model)
            res_dict = driver_entity.to_dict()

            # WebSocket notification
            summary = self.get_summary()
            self.websocket_service.emit_driver_registered(res_dict)
            self.websocket_service.emit_driver_summary_updated(summary)

            return res_dict

        except SQLAlchemyError as e:
            db.session.rollback()
            if saved_photo_path:
                self.remove_profile_picture_file(saved_photo_path)
            raise DriverServiceError("Failed to register driver in database.", status_code=500) from e
        except Exception as e:
            db.session.rollback()
            if saved_photo_path:
                self.remove_profile_picture_file(saved_photo_path)
            if isinstance(e, DriverServiceError):
                raise e
            raise DriverServiceError("An unexpected error occurred while creating driver.", status_code=500) from e

    def update_driver(self, driver_id, driver_data, assignment_data=None, image_file=None, user_id=None):
        existing_model = self.driver_repo.get_by_id(driver_id)
        if not existing_model:
            raise DriverServiceError("Driver not found.", status_code=404)

        val_errors = self.driver_validator.validate(driver_data)
        if val_errors:
            raise DriverServiceError("Validation failed.", errors=val_errors, status_code=400)

        # Uniqueness checks excluding current driver_id
        license_no = str(driver_data.get('license_number')).strip()
        if self.driver_repo.get_by_license(license_no, exclude_driver_id=driver_id):
            raise DriverServiceError("Validation failed.", errors={"license_number": "This licence number already exists."}, status_code=400)

        nic = str(driver_data.get('nic')).strip() if driver_data.get('nic') else None
        if nic and self.driver_repo.get_by_nic(nic, exclude_driver_id=driver_id):
            raise DriverServiceError("Validation failed.", errors={"nic": "This NIC number already exists."}, status_code=400)

        email = str(driver_data.get('email_address')).strip() if driver_data.get('email_address') else None
        if email and self.driver_repo.get_by_email(email, exclude_driver_id=driver_id):
            raise DriverServiceError("Validation failed.", errors={"email_address": "This email address already exists."}, status_code=400)

        # Validate bus and route assignment data if provided
        selected_bus_id = None
        selected_route_id = None
        if assignment_data:
            assign_val_errors = self.assignment_validator.validate(assignment_data)
            if assign_val_errors:
                raise DriverServiceError("Validation failed.", errors=assign_val_errors, status_code=400)

            b_id = assignment_data.get('bus_id')
            r_id = assignment_data.get('route_id')

            if b_id is not None and r_id is not None:
                try:
                    selected_bus_id = int(b_id)
                    selected_route_id = int(r_id)
                except (ValueError, TypeError):
                    raise DriverServiceError("Validation failed.", errors={"assignment": "Invalid bus or route ID format."}, status_code=400)

                # Confirm bus existence and status
                bus = self.bus_repo.get_by_id(selected_bus_id)
                if not bus or bus.status != 'Active':
                    raise DriverServiceError("Validation failed.", errors={"bus_id": "Selected bus is invalid or inactive."}, status_code=400)

                # Confirm route existence and status
                route = self.route_repo.get_by_id(selected_route_id)
                if not route or route.status != 'Active':
                    raise DriverServiceError("Validation failed.", errors={"route_id": "Selected route is invalid or inactive."}, status_code=400)

                # Confirm bus is not used in another active assignment
                if self.assignment_repo.is_bus_assigned_active(selected_bus_id, exclude_driver_id=driver_id):
                    raise DriverServiceError("Validation failed.", errors={"bus_id": "Selected bus is already assigned to another active driver."}, status_code=400)

        # Handle profile photo upload replacement
        new_photo_path = None
        old_photo_path = existing_model.profile_picture
        if image_file:
            new_photo_path = self.save_profile_picture(image_file)
            driver_data['profile_picture'] = new_photo_path

        try:
            self.driver_repo.update(existing_model, data=driver_data, commit=False)

            # Handle bus_assignment update/creation inside transaction
            if selected_bus_id is not None and selected_route_id is not None:
                current_assignment = self.assignment_repo.get_active_by_driver_id(driver_id)
                if current_assignment:
                    current_assignment.bus_id = selected_bus_id
                    current_assignment.route_id = selected_route_id
                    current_assignment.assigned_date = date.today()
                else:
                    self.assignment_repo.create({
                        "bus_id": selected_bus_id,
                        "driver_id": driver_id,
                        "route_id": selected_route_id,
                        "assigned_date": date.today(),
                        "status": "Active"
                    }, commit=False)

            # Activity logging in same transaction
            if user_id:
                self.activity_repo.create({
                    "user_id": user_id,
                    "activity": f"Updated driver details for '{existing_model.full_name}' (ID: {driver_id})."
                }, commit=False)

            db.session.commit()

            # Clean up old profile photo file after successful commit
            if new_photo_path and old_photo_path and old_photo_path != new_photo_path:
                self.remove_profile_picture_file(old_photo_path)

            driver_entity = self.driver_repo._model_to_entity(existing_model)
            res_dict = driver_entity.to_dict()

            summary = self.get_summary()
            self.websocket_service.emit_driver_updated(res_dict)
            self.websocket_service.emit_driver_summary_updated(summary)
            if selected_bus_id is not None and selected_route_id is not None:
                self.websocket_service.emit_bus_assignment_updated({
                    "driver_id": driver_id,
                    "bus_id": selected_bus_id,
                    "route_id": selected_route_id
                })

            return res_dict

        except SQLAlchemyError as e:
            db.session.rollback()
            if new_photo_path:
                self.remove_profile_picture_file(new_photo_path)
            raise DriverServiceError("Failed to update driver in database.", status_code=500) from e
        except Exception as e:
            db.session.rollback()
            if new_photo_path:
                self.remove_profile_picture_file(new_photo_path)
            if isinstance(e, DriverServiceError):
                raise e
            raise DriverServiceError("An unexpected error occurred while updating driver.", status_code=500) from e

    def deactivate_driver(self, driver_id, user_id=None):
        driver_model = self.driver_repo.get_by_id(driver_id)
        if not driver_model:
            raise DriverServiceError("Driver not found.", status_code=404)

        if driver_model.status == "Inactive":
            raise DriverServiceError("This driver is already inactive.", status_code=409)

        previous_status = driver_model.status

        try:
            # 1. Update driver status to Inactive
            driver_model.status = "Inactive"

            # 2. Cancel active bus assignment if present
            active_assignment = self.assignment_repo.get_active_by_driver_id(driver_id)
            assignment_status_result = "None"
            if active_assignment:
                active_assignment.status = "Cancelled"
                assignment_status_result = "Cancelled"

            # 3. Log activity in single transaction
            if user_id:
                self.activity_repo.create({
                    "user_id": user_id,
                    "activity": f"Driver '{driver_model.full_name}' (ID: {driver_id}) was deactivated. Status changed from {previous_status} to Inactive."
                }, commit=False)

            db.session.commit()

            deactivate_payload = {
                "driverId": driver_id,
                "fullName": driver_model.full_name,
                "previousStatus": previous_status,
                "currentStatus": "Inactive",
                "assignmentStatus": assignment_status_result
            }

            summary = self.get_summary()
            self.websocket_service.emit_driver_deactivated(deactivate_payload)
            self.websocket_service.emit_driver_summary_updated(summary)
            if assignment_status_result == "Cancelled":
                self.websocket_service.emit_bus_assignment_updated({
                    "driver_id": driver_id,
                    "cancelled": True
                })

            return deactivate_payload

        except SQLAlchemyError as e:
            db.session.rollback()
            raise DriverServiceError("Unable to deactivate the driver at the moment.", status_code=500) from e
        except Exception as e:
            db.session.rollback()
            if isinstance(e, DriverServiceError):
                raise e
            raise DriverServiceError("Unable to deactivate the driver at the moment.", status_code=500) from e
