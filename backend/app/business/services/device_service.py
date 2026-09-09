from app.data.repositories.device_repository import DeviceRepository
from app.business.services.websocket_service import WebSocketService
from app.business.exceptions.application_exceptions import ValidationError, ApplicationError
from sqlalchemy.exc import SQLAlchemyError

class DeviceServiceError(ApplicationError):
    def __init__(self, message="Device service error occurred.", errors=None, status_code=400):
        super().__init__(message, status_code=status_code)
        self.errors = errors or {}

class DeviceService:

    def __init__(self, device_repository=None, websocket_service=None):
        self.device_repository = device_repository or DeviceRepository()
        self.websocket_service = websocket_service or WebSocketService()

    def get_devices(self, keyword=None, device_type=None, status=None):
        try:
            devices = self.device_repository.get_all(keyword=keyword, device_type=device_type, status=status)
            return [d.to_dict() for d in devices]
        except SQLAlchemyError as e:
            raise DeviceServiceError("Failed to fetch devices from database.", status_code=500)

    def get_summary(self):
        try:
            return self.device_repository.get_summary()
        except SQLAlchemyError as e:
            raise DeviceServiceError("Failed to compute device summary statistics.", status_code=500)

    def get_device_types(self):
        try:
            return self.device_repository.get_device_types()
        except SQLAlchemyError as e:
            raise DeviceServiceError("Failed to load device types.", status_code=500)

    def get_device_statuses(self):
        try:
            return self.device_repository.get_device_statuses()
        except SQLAlchemyError as e:
            raise DeviceServiceError("Failed to load device statuses.", status_code=500)

    def get_bus_device_statuses(self):
        return self.device_repository.get_bus_device_statuses()

    def get_available_buses(self):
        try:
            return self.device_repository.get_buses()
        except SQLAlchemyError as e:
            raise DeviceServiceError("Failed to load buses.", status_code=500)

    def get_device_by_id(self, device_id):
        try:
            device = self.device_repository.get_by_id(device_id)
            if not device:
                raise DeviceServiceError(f"Device with ID {device_id} not found.", status_code=404)

            data = device.to_dict()

            # If Bus Unit, attach assignment info if present
            if device.device_type == 'Bus Unit':
                bus_device = self.device_repository.get_bus_device_by_device_id(device_id)
                if bus_device:
                    data['assignment'] = bus_device.to_dict()
                    data['bus_device'] = bus_device.to_dict()
                else:
                    data['assignment'] = None
                    data['bus_device'] = None
            else:
                data['assignment'] = None
                data['bus_device'] = None

            return data
        except DeviceServiceError:
            raise
        except SQLAlchemyError as e:
            raise DeviceServiceError("Database error occurred while fetching device details.", status_code=500)

    def _validate_device_payload(self, data, is_update=False, exclude_id=None):
        errors = {}

        code = data.get('deviceCode') or data.get('device_code')
        if not code or not str(code).strip():
            errors['deviceCode'] = 'Device Code is required.'
        else:
            existing = self.device_repository.get_by_code(str(code).strip(), exclude_id=exclude_id)
            if existing:
                errors['deviceCode'] = f"Device code '{code}' is already registered."

        name = data.get('deviceName') or data.get('device_name')
        if not name or not str(name).strip():
            errors['deviceName'] = 'Device Name is required.'

        dev_type = data.get('deviceType') or data.get('device_type')
        if not dev_type or str(dev_type).strip() not in ['Bus Unit', 'Roadside Unit']:
            errors['deviceType'] = "Device Type must be 'Bus Unit' or 'Roadside Unit'."

        mac = data.get('macAddress') or data.get('mac_address')
        if mac and str(mac).strip():
            existing_mac = self.device_repository.get_by_mac(str(mac).strip(), exclude_id=exclude_id)
            if existing_mac:
                errors['macAddress'] = f"MAC Address '{mac}' is already registered."

        status = data.get('status')
        if status and status not in ['Active', 'Inactive', 'Maintenance']:
            errors['status'] = "Status must be 'Active', 'Inactive', or 'Maintenance'."

        # If Bus Unit, validate bus assignment parameters
        if dev_type == 'Bus Unit':
            assignment_data = data.get('assignment') or data.get('busDevice') or data
            bus_id = assignment_data.get('busId') or assignment_data.get('bus_id')
            if not bus_id:
                errors['busId'] = 'Bus selection is required for Bus Unit devices.'

        if errors:
            raise ValidationError("Please fix the validation errors.", errors=errors)

    def create_device(self, data, user_id=None):
        self._validate_device_payload(data, is_update=False)

        dev_type = data.get('deviceType') or data.get('device_type')
        assignment_data = data.get('assignment') or data.get('busDevice') or data

        try:
            # 1. Insert into device_registry (uncommitted in transaction)
            device = self.device_repository.create(data, commit=False)

            created_assignment = None
            if dev_type == 'Bus Unit':
                assignment_payload = {
                    'busId': assignment_data.get('busId') or assignment_data.get('bus_id'),
                    'deviceId': device.device_id,
                    'installationLocation': assignment_data.get('installationLocation') or assignment_data.get('installation_location') or '',
                    'installedDate': assignment_data.get('installedDate') or assignment_data.get('installed_date') or data.get('installationDate') or data.get('installation_date'),
                    'status': assignment_data.get('status') or data.get('status') or 'Active'
                }
                created_assignment = self.device_repository.create_bus_device(assignment_payload, commit=False)

            # 2. COMMIT TRANSACTION
            self.device_repository.commit()

            result = device.to_dict()
            if created_assignment:
                result['assignment'] = created_assignment.to_dict()
                result['bus_device'] = created_assignment.to_dict()

            # 3. AFTER COMMIT: Emit Socket.IO events
            try:
                self.websocket_service.emit_device_created(result)
                summary = self.device_repository.get_summary()
                self.websocket_service.emit_device_summary_updated(summary)
            except Exception:
                pass

            return result

        except ValidationError:
            self.device_repository.rollback()
            raise
        except SQLAlchemyError as e:
            self.device_repository.rollback()
            raise DeviceServiceError("Database transaction failed while creating device.", status_code=500)
        except Exception as e:
            self.device_repository.rollback()
            raise DeviceServiceError(f"Failed to create device: {str(e)}", status_code=500)

    def update_device(self, device_id, data, user_id=None):
        existing = self.device_repository.get_by_id(device_id)
        if not existing:
            raise DeviceServiceError(f"Device with ID {device_id} not found.", status_code=404)

        self._validate_device_payload(data, is_update=True, exclude_id=device_id)

        dev_type = data.get('deviceType') or data.get('device_type') or existing.device_type
        assignment_data = data.get('assignment') or data.get('busDevice') or data

        try:
            # 1. Update device_registry
            updated_device = self.device_repository.update(device_id, data, commit=False)

            updated_assignment = None
            if dev_type == 'Bus Unit':
                assignment_payload = {
                    'busId': assignment_data.get('busId') or assignment_data.get('bus_id'),
                    'deviceId': device_id,
                    'installationLocation': assignment_data.get('installationLocation') or assignment_data.get('installation_location'),
                    'installedDate': assignment_data.get('installedDate') or assignment_data.get('installed_date') or data.get('installationDate') or data.get('installation_date'),
                    'status': assignment_data.get('status') or data.get('status') or 'Active'
                }
                updated_assignment = self.device_repository.update_bus_device(device_id, assignment_payload, commit=False)

            # 2. COMMIT TRANSACTION
            self.device_repository.commit()

            if not updated_device:
                raise DeviceServiceError(f"Failed to update device with ID {device_id}.", status_code=500)

            result = updated_device.to_dict()
            if updated_assignment:
                result['assignment'] = updated_assignment.to_dict()
                result['bus_device'] = updated_assignment.to_dict()

            # 3. AFTER COMMIT: Emit Socket.IO events
            try:
                self.websocket_service.emit_device_updated(result)
                summary = self.device_repository.get_summary()
                self.websocket_service.emit_device_summary_updated(summary)
            except Exception:
                pass

            return result

        except ValidationError:
            self.device_repository.rollback()
            raise
        except SQLAlchemyError as e:
            self.device_repository.rollback()
            raise DeviceServiceError("Database transaction failed while updating device.", status_code=500)
        except Exception as e:
            self.device_repository.rollback()
            raise DeviceServiceError(f"Failed to update device: {str(e)}", status_code=500)

    def set_inactive(self, device_id, user_id=None):
        existing = self.device_repository.get_by_id(device_id)
        if not existing:
            raise DeviceServiceError(f"Device with ID {device_id} not found.", status_code=404)

        try:
            updated_device = self.device_repository.set_status_inactive(device_id, commit=True)
            if not updated_device:
                raise DeviceServiceError(f"Device with ID {device_id} could not be updated.", status_code=404)

            result = updated_device.to_dict()

            # Emit real-time status changed
            try:
                self.websocket_service.emit_device_status_changed({
                    'deviceId': device_id,
                    'device_id': device_id,
                    'status': 'Inactive'
                })
                summary = self.device_repository.get_summary()
                self.websocket_service.emit_device_summary_updated(summary)
            except Exception:
                pass

            return result
        except SQLAlchemyError as e:
            self.device_repository.rollback()
            raise DeviceServiceError("Database error occurred while setting device to Inactive.", status_code=500)
