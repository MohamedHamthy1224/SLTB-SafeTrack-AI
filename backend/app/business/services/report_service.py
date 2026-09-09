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

    def export_buses_pdf(self, params, user_info="SLTB Admin"):
        data = self.bus_service.get_export_data(params)
        summary = self.bus_service.repository.get_summary() if hasattr(self.bus_service, 'repository') else None
        filters = params.get('filters', {})
        return self.export_service.generate_buses_pdf(data, summary=summary, filters=filters, user_info=user_info)

    def export_buses_csv(self, params, user_info="SLTB Admin"):
        return self.export_buses_pdf(params, user_info=user_info)

    # Routes Report
    def get_routes_report(self, params):
        return self.route_service.get_routes_report(params)

    def get_routes_options(self):
        return self.route_service.get_filter_options()

    def export_routes_pdf(self, params, user_info="SLTB Admin"):
        data = self.route_service.get_export_data(params)
        summary = self.route_service.repository.get_summary() if hasattr(self.route_service, 'repository') else None
        filters = params.get('filters', {})
        return self.export_service.generate_routes_pdf(data, summary=summary, filters=filters, user_info=user_info)

    def export_routes_csv(self, params, user_info="SLTB Admin"):
        return self.export_routes_pdf(params, user_info=user_info)

    # Drivers Report
    def get_drivers_report(self, params):
        return self.driver_service.get_drivers_report(params)

    def get_drivers_options(self):
        return self.driver_service.get_filter_options()

    def export_drivers_pdf(self, params, user_info="SLTB Admin"):
        data = self.driver_service.get_export_data(params)
        summary = self.driver_service.repository.get_summary() if hasattr(self.driver_service, 'repository') else None
        filters = params.get('filters', {})
        return self.export_service.generate_drivers_pdf(data, summary=summary, filters=filters, user_info=user_info)

    def export_drivers_csv(self, params, user_info="SLTB Admin"):
        return self.export_drivers_pdf(params, user_info=user_info)

    # Assignment History Report
    def get_assignment_history_report(self, params):
        return self.assignment_service.get_assignment_history_report(params)

    def export_assignment_history_pdf(self, params, user_info="SLTB Admin"):
        data = self.assignment_service.get_export_data(params)
        summary = self.assignment_service.repository.get_summary() if hasattr(self.assignment_service, 'repository') else None
        filters = params.get('filters', {})
        return self.export_service.generate_assignment_history_pdf(data, summary=summary, filters=filters, user_info=user_info)

    def export_assignment_history_csv(self, params, user_info="SLTB Admin"):
        return self.export_assignment_history_pdf(params, user_info=user_info)

    # Sensors and Alerts Report
    def get_sensors_alerts_report(self, params):
        return self.alert_service.get_sensor_alerts_report(params)

    def get_sensors_alerts_options(self):
        return self.alert_service.get_filter_options()

    def export_sensors_alerts_pdf(self, params, user_info="SLTB Admin"):
        data = self.alert_service.get_export_data(params)
        summary = self.alert_service.repository.get_summary() if hasattr(self.alert_service, 'repository') else None
        filters = params.get('filters', {})
        return self.export_service.generate_alerts_pdf(data, summary=summary, filters=filters, user_info=user_info)

    def export_sensors_alerts_csv(self, params, user_info="SLTB Admin"):
        return self.export_sensors_alerts_pdf(params, user_info=user_info)
