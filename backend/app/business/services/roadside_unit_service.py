from app.data.repositories.roadside_unit_repository import RoadsideUnitRepository
from app.data.repositories.device_repository import DeviceRepository
from app.data.repositories.route_repository import RouteRepository
from app.data.repositories.activity_log_repository import ActivityLogRepository
from app.business.services.websocket_service import WebSocketService
from app.business.services.pdf_generator_service import PDFGeneratorService
from app.business.exceptions.application_exceptions import ValidationError, ApplicationError
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

class RoadsideUnitServiceError(ApplicationError):
    def __init__(self, message="Roadside unit service error occurred.", errors=None, status_code=400):
        super().__init__(message, status_code=status_code)
        self.errors = errors or {}

class RoadsideUnitService:
    def __init__(
        self,
        roadside_unit_repository=None,
        device_repository=None,
        route_repository=None,
        activity_log_repository=None,
        websocket_service=None
    ):
        self.roadside_unit_repository = roadside_unit_repository or RoadsideUnitRepository()
        self.device_repository = device_repository or DeviceRepository()
        self.route_repository = route_repository or RouteRepository()
        self.activity_log_repository = activity_log_repository or ActivityLogRepository()
        self.websocket_service = websocket_service or WebSocketService()

    def get_units(self, keyword=None, status=None, route_id=None):
        try:
            units = self.roadside_unit_repository.get_all(keyword=keyword, status=status, route_id=route_id)
            return [u.to_dict() for u in units]
        except SQLAlchemyError as e:
            raise RoadsideUnitServiceError("Failed to fetch roadside U-turn units from database.", status_code=500)

    def get_summary(self):
        try:
            return self.roadside_unit_repository.get_summary()
        except SQLAlchemyError as e:
            raise RoadsideUnitServiceError("Failed to compute U-turn summary statistics.", status_code=500)

    def get_statuses(self):
        try:
            return self.roadside_unit_repository.get_statuses()
        except SQLAlchemyError as e:
            raise RoadsideUnitServiceError("Failed to load status options.", status_code=500)

    def get_routes(self):
        try:
            return self.roadside_unit_repository.get_routes()
        except SQLAlchemyError as e:
            raise RoadsideUnitServiceError("Failed to load route options.", status_code=500)

    def get_devices(self):
        try:
            return self.roadside_unit_repository.get_devices()
        except SQLAlchemyError as e:
            raise RoadsideUnitServiceError("Failed to load device options.", status_code=500)

    def get_unit_by_id(self, unit_id):
        try:
            unit = self.roadside_unit_repository.get_by_id(unit_id)
            if not unit:
                raise RoadsideUnitServiceError(f"Roadside U-Turn unit with ID {unit_id} not found.", status_code=404)
            return unit.to_dict()
        except RoadsideUnitServiceError:
            raise
        except SQLAlchemyError as e:
            raise RoadsideUnitServiceError("Database error occurred while fetching unit details.", status_code=500)

    def _validate_unit_payload(self, data, is_update=False, exclude_id=None):
        errors = {}

        # 1. Device ID validation
        if not is_update or ('deviceId' in data or 'device_id' in data):
            device_id = data.get('deviceId') if 'deviceId' in data else data.get('device_id')
            if not device_id:
                errors['deviceId'] = 'Device selection is required.'
            else:
                try:
                    dev_id_int = int(device_id)
                    device = self.device_repository.get_by_id(dev_id_int)
                    if not device:
                        errors['deviceId'] = f"Device with ID {device_id} is not registered in device registry."
                except (ValueError, TypeError):
                    errors['deviceId'] = 'Invalid Device ID format.'

        # 2. Route ID validation (optional)
        if 'routeId' in data or 'route_id' in data:
            route_id = data.get('routeId') if 'routeId' in data else data.get('route_id')
            if route_id is not None and str(route_id).strip() != '' and str(route_id).strip().lower() != 'none':
                try:
                    route_id_int = int(route_id)
                    route = self.route_repository.get_by_id(route_id_int)
                    if not route:
                        errors['routeId'] = f"Route with ID {route_id} does not exist."
                except (ValueError, TypeError):
                    errors['routeId'] = 'Invalid Route ID format.'

        # 3. Location Name validation
        if not is_update or ('locationName' in data or 'location_name' in data):
            location_name = data.get('locationName') if 'locationName' in data else data.get('location_name')
            if not location_name or not str(location_name).strip():
                errors['locationName'] = 'Location Name is required.'
            elif len(str(location_name).strip()) > 150:
                errors['locationName'] = 'Location Name must not exceed 150 characters.'

        # 4. Latitude validation (optional, -90 to 90)
        latitude = data.get('latitude')
        if latitude is not None and str(latitude).strip() != '':
            try:
                lat_float = float(latitude)
                if lat_float < -90.0 or lat_float > 90.0:
                    errors['latitude'] = 'Latitude must be between -90 and 90 degrees.'
            except (ValueError, TypeError):
                errors['latitude'] = 'Latitude must be a valid numeric value.'

        # 5. Longitude validation (optional, -180 to 180)
        longitude = data.get('longitude')
        if longitude is not None and str(longitude).strip() != '':
            try:
                lng_float = float(longitude)
                if lng_float < -180.0 or lng_float > 180.0:
                    errors['longitude'] = 'Longitude must be between -180 and 180 degrees.'
            except (ValueError, TypeError):
                errors['longitude'] = 'Longitude must be a valid numeric value.'

        # 6. Installation Date validation (optional, YYYY-MM-DD)
        inst_date = data.get('installationDate') if 'installationDate' in data else data.get('installation_date')
        if inst_date and isinstance(inst_date, str) and inst_date.strip():
            try:
                datetime.strptime(inst_date.strip(), '%Y-%m-%d')
            except ValueError:
                errors['installationDate'] = 'Installation Date must follow YYYY-MM-DD format.'

        # 7. Status validation
        status = data.get('status')
        if status and status not in ['Active', 'Inactive', 'Maintenance']:
            errors['status'] = "Status must be 'Active', 'Inactive', or 'Maintenance'."

        if errors:
            raise ValidationError("Please fix the validation errors.", errors=errors)

    def create_unit(self, data, user_id=None):
        self._validate_unit_payload(data, is_update=False)

        try:
            # 1. Save unit in database (in transaction)
            unit = self.roadside_unit_repository.create(data, commit=False)

            # 2. Commit transaction
            self.roadside_unit_repository.commit()

            result = unit.to_dict()

            # 3. Log user activity
            if user_id:
                try:
                    self.activity_log_repository.log_activity(
                        user_id,
                        f"Created roadside U-Turn unit #{unit.roadside_unit_id} ({unit.location_name})"
                    )
                except Exception:
                    pass

            return result
        except ValidationError:
            self.roadside_unit_repository.rollback()
            raise
        except SQLAlchemyError as e:
            self.roadside_unit_repository.rollback()
            raise RoadsideUnitServiceError("Database transaction failed while creating U-turn unit.", status_code=500)
        except Exception as e:
            self.roadside_unit_repository.rollback()
            raise RoadsideUnitServiceError(f"Failed to create U-turn unit: {str(e)}", status_code=500)

    def update_unit(self, unit_id, data, user_id=None):
        existing = self.roadside_unit_repository.get_by_id(unit_id)
        if not existing:
            raise RoadsideUnitServiceError(f"Roadside U-Turn unit with ID {unit_id} not found.", status_code=404)

        self._validate_unit_payload(data, is_update=True, exclude_id=unit_id)

        try:
            updated = self.roadside_unit_repository.update(unit_id, data, commit=False)
            self.roadside_unit_repository.commit()

            if not updated:
                raise RoadsideUnitServiceError(f"Failed to update roadside unit with ID {unit_id}.", status_code=500)

            result = updated.to_dict()

            # Log user activity
            if user_id:
                try:
                    self.activity_log_repository.log_activity(
                        user_id,
                        f"Updated roadside U-Turn unit #{unit_id} ({updated.location_name})"
                    )
                except Exception:
                    pass

            return result
        except ValidationError:
            self.roadside_unit_repository.rollback()
            raise
        except SQLAlchemyError as e:
            self.roadside_unit_repository.rollback()
            raise RoadsideUnitServiceError("Database transaction failed while updating U-turn unit.", status_code=500)
        except Exception as e:
            self.roadside_unit_repository.rollback()
            raise RoadsideUnitServiceError(f"Failed to update U-turn unit: {str(e)}", status_code=500)

    def deactivate_unit(self, unit_id, user_id=None):
        existing = self.roadside_unit_repository.get_by_id(unit_id)
        if not existing:
            raise RoadsideUnitServiceError(f"Roadside U-Turn unit with ID {unit_id} not found.", status_code=404)

        try:
            deactivated = self.roadside_unit_repository.set_inactive(unit_id, commit=False)
            self.roadside_unit_repository.commit()

            if not deactivated:
                raise RoadsideUnitServiceError(f"Failed to deactivate unit with ID {unit_id}.", status_code=500)

            result = deactivated.to_dict()

            # Log user activity
            if user_id:
                try:
                    self.activity_log_repository.log_activity(
                        user_id,
                        f"Deactivated roadside U-Turn unit #{unit_id} ({deactivated.location_name})"
                    )
                except Exception:
                    pass

            return result
        except SQLAlchemyError as e:
            self.roadside_unit_repository.rollback()
            raise RoadsideUnitServiceError("Database error occurred while deactivating unit.", status_code=500)
        except Exception as e:
            self.roadside_unit_repository.rollback()
            raise RoadsideUnitServiceError(f"Failed to deactivate unit: {str(e)}", status_code=500)

    def export_pdf(self, search=None, status=None, route_id=None, current_user_id=None):
        try:
            units = self.roadside_unit_repository.get_all(keyword=search, status=status, route_id=route_id)
            rows = []
            for u in units:
                route_str = '—'
                if u.route:
                    route_str = f"Route {u.route.route_number}" if u.route.route_number else u.route.route_name
                elif u.route_id:
                    route_str = f"Route #{u.route_id}"

                rows.append({
                    'unitId': u.roadside_unit_id,
                    'locationName': u.location_name,
                    'latitude': str(u.latitude) if u.latitude is not None else '—',
                    'longitude': str(u.longitude) if u.longitude is not None else '—',
                    'deviceId': u.device.device_code if u.device else str(u.device_id),
                    'route': route_str,
                    'status': u.status or 'Active',
                    'installedDate': str(u.installation_date) if u.installation_date else '—'
                })

            cols = [
                {'header': 'Unit ID', 'key': 'unitId', 'width': 8, 'align': 'left'},
                {'header': 'Location Name', 'key': 'locationName', 'width': 22, 'align': 'left'},
                {'header': 'Latitude', 'key': 'latitude', 'width': 12, 'align': 'left'},
                {'header': 'Longitude', 'key': 'longitude', 'width': 12, 'align': 'left'},
                {'header': 'Device ID', 'key': 'deviceId', 'width': 10, 'align': 'left'},
                {'header': 'Route', 'key': 'route', 'width': 12, 'align': 'left'},
                {'header': 'Status', 'key': 'status', 'width': 10, 'align': 'left'},
                {'header': 'Installed Date', 'key': 'installedDate', 'width': 14, 'align': 'left'},
            ]

            if current_user_id:
                try:
                    self.activity_log_repository.log_activity(
                        current_user_id,
                        "Exported roadside U-Turn units PDF report"
                    )
                except Exception:
                    pass

            summary_metrics = {'Total Units': len(rows)}
            filter_info = {
                'Search': search or None,
                'Status': status if status and status.lower() not in ('all', 'all status') else None,
                'Route': route_id if route_id and route_id.lower() not in ('all', 'all routes') else None
            }

            pdf_bytes = PDFGeneratorService.generate_report_pdf(
                title="SLTB SAFETRACK AI - POLICE ROADSIDE U-TURN UNITS REPORT",
                columns=cols,
                rows=rows,
                summary_metrics=summary_metrics,
                filter_info=filter_info,
                user_info=f"User #{current_user_id}" if current_user_id else "Police Admin"
            )
            return pdf_bytes
        except Exception as e:
            raise RoadsideUnitServiceError(f"Failed to generate PDF report: {str(e)}", status_code=500)
