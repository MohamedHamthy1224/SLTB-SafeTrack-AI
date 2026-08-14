from app.business.services.bus_report_service import BusReportService
from app.business.services.route_report_service import RouteReportService
from app.business.services.driver_report_service import DriverReportService
from app.business.services.assignment_history_report_service import AssignmentHistoryReportService
from app.business.services.sensor_alert_report_service import SensorAlertReportService
from app.business.services.report_export_service import ReportExportService

class ReportService:

    def __init__(self):
        self.bus_service = BusReportService()
        self.route_service = RouteReportService()
        self.driver_service = DriverReportService()
        self.assignment_service = AssignmentHistoryReportService()
        self.alert_service = SensorAlertReportService()
        self.export_service = ReportExportService()

    # Buses Report
    def get_buses_report(self, params):
        return self.bus_service.get_buses_report(params)

    def get_buses_options(self):
        return self.bus_service.get_filter_options()

    def export_buses_csv(self, params):
        data = self.bus_service.get_export_data(params)
        return self.export_service.generate_buses_csv(data)

    # Routes Report
    def get_routes_report(self, params):
        return self.route_service.get_routes_report(params)

    def get_routes_options(self):
        return self.route_service.get_filter_options()

    def export_routes_csv(self, params):
        data = self.route_service.get_export_data(params)
        return self.export_service.generate_routes_csv(data)

    # Drivers Report
    def get_drivers_report(self, params):
        return self.driver_service.get_drivers_report(params)

    def get_drivers_options(self):
        return self.driver_service.get_filter_options()

    def export_drivers_csv(self, params):
        data = self.driver_service.get_export_data(params)
        return self.export_service.generate_drivers_csv(data)

    # Assignment History Report
    def get_assignment_history_report(self, params):
        return self.assignment_service.get_assignment_history_report(params)

    def export_assignment_history_csv(self, params):
        data = self.assignment_service.get_export_data(params)
        return self.export_service.generate_assignment_history_csv(data)

    # Sensors and Alerts Report
    def get_sensors_alerts_report(self, params):
        return self.alert_service.get_sensor_alerts_report(params)

    def get_sensors_alerts_options(self):
        return self.alert_service.get_filter_options()

    def export_sensors_alerts_csv(self, params):
        data = self.alert_service.get_export_data(params)
        return self.export_service.generate_alerts_csv(data)
