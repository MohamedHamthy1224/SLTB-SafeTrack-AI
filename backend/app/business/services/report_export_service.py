import csv
import io

class ReportExportService:

    @staticmethod
    def generate_buses_csv(buses):
        output = io.StringIO()
        writer = csv.writer(output)

        writer.writerow([
            '#', 'Bus ID', 'Registration Number', 'Bus Number', 'Service Type',
            'Depot', 'Model', 'Chassis Number', 'Engine Number', 'Capacity',
            'Standing Capacity', 'Fuel Type', 'Manufacture Year', 'Status', 'Created At'
        ])

        for idx, b in enumerate(buses, 1):
            bus_id = f"BUS-{b.get('bus_id'):04d}" if b.get('bus_id') else "Not available"
            writer.writerow([
                idx,
                bus_id,
                b.get('registration_number') or 'Not available',
                b.get('bus_number') or 'Not available',
                b.get('service_type') or 'Not available',
                b.get('depot') or 'Not available',
                b.get('model') or 'Not available',
                b.get('chassis_number') or 'Not available',
                b.get('engine_number') or 'Not available',
                b.get('capacity') if b.get('capacity') is not None else 'Not available',
                b.get('standing_capacity') if b.get('standing_capacity') is not None else 'Not available',
                b.get('fuel_type') or 'Not available',
                b.get('manufacture_year') or 'Not available',
                b.get('status') or 'Not available',
                b.get('created_at') or 'Not available'
            ])

        return output.getvalue()

    @staticmethod
    def generate_routes_csv(routes):
        output = io.StringIO()
        writer = csv.writer(output)

        writer.writerow([
            '#', 'Route Number', 'Route Name', 'Start Location', 'End Location',
            'Distance (km)', 'Estimated Duration (min)', 'Status', 'Created At'
        ])

        for idx, r in enumerate(routes, 1):
            writer.writerow([
                idx,
                r.get('route_number') or 'Not available',
                r.get('route_name') or 'Not available',
                r.get('start_location') or 'Not available',
                r.get('end_location') or 'Not available',
                r.get('distance_km') if r.get('distance_km') is not None else 'Not available',
                r.get('estimated_duration') if r.get('estimated_duration') is not None else 'Not available',
                r.get('status') or 'Not available',
                r.get('created_at') or 'Not available'
            ])

        return output.getvalue()

    @staticmethod
    def generate_drivers_csv(drivers):
        output = io.StringIO()
        writer = csv.writer(output)

        writer.writerow([
            '#', 'Driver ID', 'Full Name', 'Date of Birth', 'Gender', 'NIC',
            'Licence Number', 'Issue Date', 'Expiry Date', 'Experience Years',
            'Phone', 'Alternative Phone', 'Email', 'Join Date', 'Status', 'Created At'
        ])

        for idx, d in enumerate(drivers, 1):
            driver_id = f"DRV-{d.get('driver_id'):04d}" if d.get('driver_id') else "Not available"
            writer.writerow([
                idx,
                driver_id,
                d.get('full_name') or 'Not available',
                d.get('date_of_birth') or 'Not available',
                d.get('gender') or 'Not available',
                d.get('nic') or 'Not available',
                d.get('license_number') or 'Not available',
                d.get('issue_date') or 'Not available',
                d.get('expiry_date') or 'Not available',
                d.get('experience_years') if d.get('experience_years') is not None else 'Not available',
                d.get('phone') or 'Not available',
                d.get('alternative_phone_number') or 'Not available',
                d.get('email_address') or 'Not available',
                d.get('join_date') or 'Not available',
                d.get('status') or 'Not available',
                d.get('created_at') or 'Not available'
            ])

        return output.getvalue()

    @staticmethod
    def generate_assignment_history_csv(assignments):
        output = io.StringIO()
        writer = csv.writer(output)

        writer.writerow([
            '#', 'Assignment History ID', 'Bus ID', 'Driver ID', 'Route ID',
            'Start Date Time', 'End Date Time', 'Assigned By'
        ])

        for idx, a in enumerate(assignments, 1):
            ah_id = f"AH-{a.get('assignment_history_id'):04d}" if a.get('assignment_history_id') else "Not available"
            bus_id = f"BUS-{a.get('bus_id'):04d}" if a.get('bus_id') else "Not available"
            driver_id = f"DRV-{a.get('driver_id'):04d}" if a.get('driver_id') else "Not available"
            route_id = f"ROU-{a.get('route_id'):04d}" if a.get('route_id') else "Not available"
            assigned_by = f"ADMIN-{a.get('assigned_by'):03d}" if a.get('assigned_by') else "SYSTEM"

            writer.writerow([
                idx,
                ah_id,
                bus_id,
                driver_id,
                route_id,
                a.get('start_datetime') or 'Not available',
                a.get('end_datetime') or 'Ongoing',
                assigned_by
            ])

        return output.getvalue()

    @staticmethod
    def generate_alerts_csv(alerts):
        output = io.StringIO()
        writer = csv.writer(output)

        writer.writerow([
            '#', 'Bus Alert ID', 'Bus ID', 'Device ID', 'Assignment ID',
            'Sensor Data ID', 'Alert Time'
        ])

        for idx, al in enumerate(alerts, 1):
            ba_id = f"BA-{al.get('bus_alert_id'):04d}" if al.get('bus_alert_id') else "Not available"
            bus_id = f"BUS-{al.get('bus_id'):04d}" if al.get('bus_id') else "Not available"
            dev_id = f"DEV-{al.get('device_id'):04d}" if al.get('device_id') else "Not available"
            asn_id = f"ASN-{al.get('assignment_id'):04d}" if al.get('assignment_id') else "Not available"
            sd_id = f"SD-{al.get('sensor_data_id'):04d}" if al.get('sensor_data_id') else "Not available"

            writer.writerow([
                idx,
                ba_id,
                bus_id,
                dev_id,
                asn_id,
                sd_id,
                al.get('alert_time') or 'Not available'
            ])

        return output.getvalue()
