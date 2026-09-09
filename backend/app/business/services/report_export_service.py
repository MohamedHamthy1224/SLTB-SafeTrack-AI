import csv
import io
from app.business.services.pdf_generator_service import PDFGeneratorService

class ReportExportService:

    # -------------------------------------------------------------
    # BUSES REPORT EXPORT
    # -------------------------------------------------------------
    @staticmethod
    def generate_buses_pdf(buses, summary=None, filters=None, user_info=None):
        cols = [
            {'header': 'Bus ID', 'key': 'bus_id_fmt', 'width': 9, 'align': 'left'},
            {'header': 'Reg Number', 'key': 'registration_number', 'width': 12, 'align': 'left'},
            {'header': 'Bus Number', 'key': 'bus_number', 'width': 11, 'align': 'left'},
            {'header': 'Service Type', 'key': 'service_type', 'width': 12, 'align': 'left'},
            {'header': 'Depot', 'key': 'depot', 'width': 13, 'align': 'left'},
            {'header': 'Model', 'key': 'model', 'width': 12, 'align': 'left'},
            {'header': 'Capacity', 'key': 'capacity', 'width': 8, 'align': 'left'},
            {'header': 'Status', 'key': 'status', 'width': 10, 'align': 'left'},
        ]

        formatted_rows = []
        for b in buses:
            b_id = f"BUS-{b.get('bus_id'):04d}" if b.get('bus_id') else "—"
            formatted_rows.append({
                'bus_id_fmt': b_id,
                'registration_number': b.get('registration_number') or '—',
                'bus_number': b.get('bus_number') or '—',
                'service_type': b.get('service_type') or '—',
                'depot': b.get('depot') or '—',
                'model': b.get('model') or '—',
                'capacity': b.get('capacity') if b.get('capacity') is not None else '—',
                'status': b.get('status') or '—'
            })

        summary_metrics = summary or {'Total Buses': len(buses)}
        filter_info = filters or {}

        return PDFGeneratorService.generate_report_pdf(
            title="SLTB SAFETRACK AI - BUSES INVENTORY REPORT",
            columns=cols,
            rows=formatted_rows,
            summary_metrics=summary_metrics,
            filter_info=filter_info,
            user_info=user_info or "SLTB Admin"
        )

    # -------------------------------------------------------------
    # ROUTES REPORT EXPORT
    # -------------------------------------------------------------
    @staticmethod
    def generate_routes_pdf(routes, summary=None, filters=None, user_info=None):
        cols = [
            {'header': 'Route ID', 'key': 'route_id_fmt', 'width': 9, 'align': 'left'},
            {'header': 'Route Number', 'key': 'route_number', 'width': 12, 'align': 'left'},
            {'header': 'Route Name', 'key': 'route_name', 'width': 22, 'align': 'left'},
            {'header': 'Start Location', 'key': 'start_location', 'width': 14, 'align': 'left'},
            {'header': 'End Location', 'key': 'end_location', 'width': 14, 'align': 'left'},
            {'header': 'Distance', 'key': 'distance_fmt', 'width': 9, 'align': 'left'},
            {'header': 'Status', 'key': 'status', 'width': 9, 'align': 'left'},
        ]

        formatted_rows = []
        for r in routes:
            r_id = f"ROU-{r.get('route_id'):04d}" if r.get('route_id') else "—"
            dist = f"{r.get('distance_km')} km" if r.get('distance_km') is not None else "—"
            formatted_rows.append({
                'route_id_fmt': r_id,
                'route_number': r.get('route_number') or '—',
                'route_name': r.get('route_name') or '—',
                'start_location': r.get('start_location') or '—',
                'end_location': r.get('end_location') or '—',
                'distance_fmt': dist,
                'status': r.get('status') or '—'
            })

        summary_metrics = summary or {'Total Routes': len(routes)}
        filter_info = filters or {}

        return PDFGeneratorService.generate_report_pdf(
            title="SLTB SAFETRACK AI - ROUTES PERFORMANCE REPORT",
            columns=cols,
            rows=formatted_rows,
            summary_metrics=summary_metrics,
            filter_info=filter_info,
            user_info=user_info or "SLTB Admin"
        )

    # -------------------------------------------------------------
    # DRIVERS REPORT EXPORT
    # -------------------------------------------------------------
    @staticmethod
    def generate_drivers_pdf(drivers, summary=None, filters=None, user_info=None):
        cols = [
            {'header': 'Driver ID', 'key': 'driver_id_fmt', 'width': 10, 'align': 'left'},
            {'header': 'Full Name', 'key': 'full_name', 'width': 18, 'align': 'left'},
            {'header': 'NIC Number', 'key': 'nic', 'width': 13, 'align': 'left'},
            {'header': 'License No', 'key': 'license_number', 'width': 13, 'align': 'left'},
            {'header': 'Phone', 'key': 'phone', 'width': 12, 'align': 'left'},
            {'header': 'Experience', 'key': 'exp_fmt', 'width': 11, 'align': 'left'},
            {'header': 'Status', 'key': 'status', 'width': 10, 'align': 'left'},
        ]

        formatted_rows = []
        for d in drivers:
            d_id = f"DRV-{d.get('driver_id'):04d}" if d.get('driver_id') else "—"
            exp = f"{d.get('experience_years')} yrs" if d.get('experience_years') is not None else "—"
            formatted_rows.append({
                'driver_id_fmt': d_id,
                'full_name': d.get('full_name') or '—',
                'nic': d.get('nic') or '—',
                'license_number': d.get('license_number') or '—',
                'phone': d.get('phone') or '—',
                'exp_fmt': exp,
                'status': d.get('status') or '—'
            })

        summary_metrics = summary or {'Total Drivers': len(drivers)}
        filter_info = filters or {}

        return PDFGeneratorService.generate_report_pdf(
            title="SLTB SAFETRACK AI - DRIVERS ROSTER REPORT",
            columns=cols,
            rows=formatted_rows,
            summary_metrics=summary_metrics,
            filter_info=filter_info,
            user_info=user_info or "SLTB Admin"
        )

    # -------------------------------------------------------------
    # ASSIGNMENT HISTORY REPORT EXPORT
    # -------------------------------------------------------------
    @staticmethod
    def generate_assignment_history_pdf(assignments, summary=None, filters=None, user_info=None):
        cols = [
            {'header': 'History ID', 'key': 'ah_id_fmt', 'width': 11, 'align': 'left'},
            {'header': 'Bus ID', 'key': 'bus_fmt', 'width': 10, 'align': 'left'},
            {'header': 'Driver ID', 'key': 'driver_fmt', 'width': 10, 'align': 'left'},
            {'header': 'Route ID', 'key': 'route_fmt', 'width': 10, 'align': 'left'},
            {'header': 'Start Date Time', 'key': 'start_datetime', 'width': 19, 'align': 'left'},
            {'header': 'End Date Time', 'key': 'end_datetime', 'width': 19, 'align': 'left'},
            {'header': 'Assigned By', 'key': 'assigned_by', 'width': 10, 'align': 'left'},
        ]

        formatted_rows = []
        for a in assignments:
            ah_id = f"AH-{a.get('assignment_history_id'):04d}" if a.get('assignment_history_id') else "—"
            bus_id = f"BUS-{a.get('bus_id'):04d}" if a.get('bus_id') else "—"
            driver_id = f"DRV-{a.get('driver_id'):04d}" if a.get('driver_id') else "—"
            route_id = f"ROU-{a.get('route_id'):04d}" if a.get('route_id') else "—"

            formatted_rows.append({
                'ah_id_fmt': ah_id,
                'bus_fmt': bus_id,
                'driver_fmt': driver_id,
                'route_fmt': route_id,
                'start_datetime': a.get('start_datetime') or '—',
                'end_datetime': a.get('end_datetime') or 'Ongoing',
                'assigned_by': f"Admin #{a.get('assigned_by')}" if a.get('assigned_by') else "System"
            })

        summary_metrics = summary or {'Total Assignments': len(assignments)}
        filter_info = filters or {}

        return PDFGeneratorService.generate_report_pdf(
            title="SLTB SAFETRACK AI - BUS ASSIGNMENT HISTORY REPORT",
            columns=cols,
            rows=formatted_rows,
            summary_metrics=summary_metrics,
            filter_info=filter_info,
            user_info=user_info or "SLTB Admin"
        )

    # -------------------------------------------------------------
    # SENSORS & ALERTS REPORT EXPORT
    # -------------------------------------------------------------
    @staticmethod
    def generate_alerts_pdf(alerts, summary=None, filters=None, user_info=None):
        cols = [
            {'header': 'Alert ID', 'key': 'ba_id_fmt', 'width': 10, 'align': 'left'},
            {'header': 'Bus ID', 'key': 'bus_fmt', 'width': 10, 'align': 'left'},
            {'header': 'Device ID', 'key': 'dev_fmt', 'width': 10, 'align': 'left'},
            {'header': 'Assignment ID', 'key': 'asn_fmt', 'width': 14, 'align': 'left'},
            {'header': 'Sensor Data ID', 'key': 'sd_fmt', 'width': 14, 'align': 'left'},
            {'header': 'Alert Time', 'key': 'alert_time', 'width': 19, 'align': 'left'},
        ]

        formatted_rows = []
        for al in alerts:
            ba_id = f"BA-{al.get('bus_alert_id'):04d}" if al.get('bus_alert_id') else "—"
            bus_id = f"BUS-{al.get('bus_id'):04d}" if al.get('bus_id') else "—"
            dev_id = f"DEV-{al.get('device_id'):04d}" if al.get('device_id') else "—"
            asn_id = f"ASN-{al.get('assignment_id'):04d}" if al.get('assignment_id') else "—"
            sd_id = f"SD-{al.get('sensor_data_id'):04d}" if al.get('sensor_data_id') else "—"

            formatted_rows.append({
                'ba_id_fmt': ba_id,
                'bus_fmt': bus_id,
                'dev_fmt': dev_id,
                'asn_fmt': asn_id,
                'sd_fmt': sd_id,
                'alert_time': al.get('alert_time') or '—'
            })

        summary_metrics = summary or {'Total Alerts': len(alerts)}
        filter_info = filters or {}

        return PDFGeneratorService.generate_report_pdf(
            title="SLTB SAFETRACK AI - ONBOARD SENSORS & ALERTS REPORT",
            columns=cols,
            rows=formatted_rows,
            summary_metrics=summary_metrics,
            filter_info=filter_info,
            user_info=user_info or "SLTB Admin"
        )

    # Legacy CSV fallbacks returning PDF bytes for compatibility
    @staticmethod
    def generate_buses_csv(buses):
        return ReportExportService.generate_buses_pdf(buses)

    @staticmethod
    def generate_routes_csv(routes):
        return ReportExportService.generate_routes_pdf(routes)

    @staticmethod
    def generate_drivers_csv(drivers):
        return ReportExportService.generate_drivers_pdf(drivers)

    @staticmethod
    def generate_assignment_history_csv(assignments):
        return ReportExportService.generate_assignment_history_pdf(assignments)

    @staticmethod
    def generate_alerts_csv(alerts):
        return ReportExportService.generate_alerts_pdf(alerts)
