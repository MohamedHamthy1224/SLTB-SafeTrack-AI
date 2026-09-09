from app.data.database import db
from app.data.models.bus_model import BusModel
from app.data.models.driver_model import DriverModel
from app.data.models.route_model import RouteModel
from app.data.models.device_registry_model import DeviceRegistryModel
from app.data.models.bus_alert_model import BusAlertModel
from app.data.models.roadside_alert_model import RoadsideAlertModel
from app.data.models.police_officer_model import PoliceOfficerModel
from app.data.models.sltb_user_model import SLTBUserModel
from app.data.models.user_model import UserModel
from app.data.models.role_model import RoleModel
from app.data.models.sensor_data_model import SensorDataModel
from app.data.models.roadside_unit_model import RoadsideUnitModel
from sqlalchemy import func, and_, or_
from datetime import datetime, timezone, timedelta

class PoliceDashboardRepository:

    def get_kpi_stats(self):
        """
        Calculates all 10 KPI statistics directly from live MySQL tables.
        """
        # 1. Total Buses
        total_buses = db.session.query(func.count(BusModel.bus_id)).scalar() or 0

        # 2. Total Drivers
        total_drivers = db.session.query(func.count(DriverModel.driver_id)).scalar() or 0

        # 3. Total Routes
        total_routes = db.session.query(func.count(RouteModel.route_id)).scalar() or 0

        # 4. Bus Devices
        bus_devices = db.session.query(func.count(DeviceRegistryModel.device_id)).filter(
            DeviceRegistryModel.device_type == 'Bus Unit'
        ).scalar() or 0

        # 5. U-Turn Devices
        uturn_devices = db.session.query(func.count(DeviceRegistryModel.device_id)).filter(
            DeviceRegistryModel.device_type == 'Roadside Unit'
        ).scalar() or 0

        # 6. Total Devices
        total_devices = db.session.query(func.count(DeviceRegistryModel.device_id)).scalar() or 0

        # 7. Bus Alerts
        bus_alerts = db.session.query(func.count(BusAlertModel.bus_alert_id)).scalar() or 0

        # 8. U-Turn Alerts
        uturn_alerts = db.session.query(func.count(RoadsideAlertModel.roadside_alert_id)).scalar() or 0

        # 9. Police Officers (from police_officers table, or users with police roles)
        police_officers = db.session.query(func.count(PoliceOfficerModel.officer_id)).scalar()
        if not police_officers:
            police_officers = db.session.query(func.count(UserModel.user_id)).join(
                RoleModel, RoleModel.role_id == UserModel.role_id
            ).filter(RoleModel.role_name.in_(['Police Admin', 'Traffic Police Officer'])).scalar() or 0

        # 10. SLTB Users (from sltb_users table, or users with SLTB role)
        sltb_users = db.session.query(func.count(SLTBUserModel.sltb_user_id)).scalar()
        if not sltb_users:
            sltb_users = db.session.query(func.count(UserModel.user_id)).join(
                RoleModel, RoleModel.role_id == UserModel.role_id
            ).filter(RoleModel.role_name == 'SLTB Admin').scalar() or 0

        return {
            'totalBuses': total_buses,
            'totalDrivers': total_drivers,
            'totalRoutes': total_routes,
            'busDevices': bus_devices,
            'uturnDevices': uturn_devices,
            'totalDevices': total_devices,
            'busAlerts': bus_alerts,
            'uturnAlerts': uturn_alerts,
            'policeOfficers': police_officers,
            'sltbUsers': sltb_users
        }

    def get_bus_safety_monitor(self):
        """
        Retrieves the latest valid telemetry record for the Bus Safety Monitor.
        """
        sensor = db.session.query(SensorDataModel).filter(
            or_(
                SensorDataModel.bus_id.isnot(None),
                SensorDataModel.roadside_unit_id.is_(None)
            )
        ).order_by(
            SensorDataModel.recorded_at.desc(),
            SensorDataModel.sensor_data_id.desc()
        ).first()

        if not sensor:
            return {
                'available': False,
                'pir': {'status': 'SAFE', 'buzzer': 'MUTE'},
                'ldr': {'status': 'SAFE', 'ledStatus': 'OFF'},
                'ultrasonic': {
                    'status': 'SAFE',
                    'distance': '—',
                    'distanceRisk': '0%',
                    'riskLevel': 'LOW',
                    'ledStatus': 'OFF'
                },
                'timestamp': None
            }

        # 1. PIR Motion
        pir_stat = str(sensor.pir_detection_status or 'SAFE').upper()
        buzzer_active = sensor.pir_buzzer_status in (1, '1', True, 'Active', 'ON', 'active')
        buzzer_str = 'ACTIVE' if buzzer_active else 'MUTE'

        # 2. LDR Light Detection
        ldr_stat = str(sensor.ldr_detection_status or 'SAFE').upper()
        ldr_led = 'ON' if sensor.ldr_led_status in (1, '1', True, 'ON', 'on') else 'OFF'

        # 3. Ultrasonic Distance Monitoring (Front)
        front_stat = str(sensor.front_detection_status or 'SAFE').upper()
        dist_cm = f"{float(sensor.front_distance_cm):.2f} cm" if sensor.front_distance_cm is not None else '—'
        
        # Risk percentage
        if sensor.front_risk_percentage is not None:
            risk_pct = f"{int(sensor.front_risk_percentage)}%"
        elif sensor.front_distance_cm is not None:
            # Derive risk percentage if not stored directly
            d = float(sensor.front_distance_cm)
            if d < 30:
                risk_pct = f"{min(100, int((30 - d) / 30 * 100))}%"
            else:
                risk_pct = "0%"
        else:
            risk_pct = "0%"

        # Risk Level
        if sensor.front_risk_level:
            risk_lvl = str(sensor.front_risk_level).upper()
        elif sensor.front_distance_cm is not None:
            d = float(sensor.front_distance_cm)
            if d < 20:
                risk_lvl = 'HIGH'
            elif d < 50:
                risk_lvl = 'MEDIUM'
            else:
                risk_lvl = 'LOW'
        else:
            risk_lvl = 'LOW'

        front_led = 'ON' if sensor.front_led_status in (1, '1', True, 'ON', 'on') else 'OFF'

        return {
            'available': True,
            'busId': sensor.bus_id,
            'deviceId': sensor.device_id,
            'pir': {
                'status': pir_stat,
                'buzzer': buzzer_str
            },
            'ldr': {
                'status': ldr_stat,
                'ledStatus': ldr_led
            },
            'ultrasonic': {
                'status': front_stat,
                'distance': dist_cm,
                'distanceRisk': risk_pct,
                'riskLevel': risk_lvl,
                'ledStatus': front_led
            },
            'timestamp': sensor.recorded_at.strftime('%d %b %Y, %I:%M %p') if sensor.recorded_at else None
        }

    def get_uturn_safety_monitor(self):
        """
        Retrieves the latest valid telemetry record for the U-Turn Safety Monitor.
        """
        sensor = db.session.query(SensorDataModel).filter(
            SensorDataModel.roadside_unit_id.isnot(None)
        ).order_by(
            SensorDataModel.recorded_at.desc(),
            SensorDataModel.sensor_data_id.desc()
        ).first()

        # Fallback to general sensor reading if dedicated roadside sensor data row is absent
        if not sensor:
            sensor = db.session.query(SensorDataModel).order_by(
                SensorDataModel.recorded_at.desc(),
                SensorDataModel.sensor_data_id.desc()
            ).first()

        if not sensor:
            return {
                'available': False,
                'leftSensor': {
                    'status': 'SAFE',
                    'ledStatus': 'OFF',
                    'distance': '—',
                    'riskPercentage': '0%',
                    'riskLevel': 'LOW'
                },
                'rightSensor': {
                    'status': 'SAFE',
                    'ledStatus': 'OFF',
                    'distance': '—',
                    'riskPercentage': '0%',
                    'riskLevel': 'LOW'
                },
                'timestamp': None
            }

        # Left Sensor
        left_stat = str(sensor.left_detection_status or 'SAFE').upper()
        left_led = 'ON' if sensor.right_led_status in (1, '1', True, 'ON', 'on') else 'OFF'
        left_dist = f"{float(sensor.left_distance_cm):.2f} cm" if sensor.left_distance_cm is not None else '—'
        left_risk_pct = f"{int(sensor.left_risk_percentage)}%" if sensor.left_risk_percentage is not None else '0%'
        left_risk_lvl = str(sensor.left_risk_level or 'LOW').upper()

        # Right Sensor
        right_stat = str(sensor.right_detection_status or 'SAFE').upper()
        right_led = 'ON' if sensor.left_led_status in (1, '1', True, 'ON', 'on') else 'OFF'
        right_dist = f"{float(sensor.right_distance_cm):.2f} cm" if sensor.right_distance_cm is not None else '—'
        right_risk_pct = f"{int(sensor.right_risk_percentage)}%" if sensor.right_risk_percentage is not None else '0%'
        right_risk_lvl = str(sensor.right_risk_level or 'LOW').upper()

        return {
            'available': True,
            'roadsideUnitId': sensor.roadside_unit_id,
            'deviceId': sensor.device_id,
            'leftSensor': {
                'status': left_stat,
                'ledStatus': left_led,
                'distance': left_dist,
                'riskPercentage': left_risk_pct,
                'riskLevel': left_risk_lvl
            },
            'rightSensor': {
                'status': right_stat,
                'ledStatus': right_led,
                'distance': right_dist,
                'riskPercentage': right_risk_pct,
                'riskLevel': right_risk_lvl
            },
            'timestamp': sensor.recorded_at.strftime('%d %b %Y, %I:%M %p') if sensor.recorded_at else None
        }

    def get_alerts_overview_chart(self, period='This Week'):
        """
        Dynamically groups bus_alerts and roadside_alerts by date for the requested period.
        Supported periods: 'Today', 'This Week', 'Last Week', '2 Weeks Ago', 'This Month'.
        """
        now = datetime.now(timezone.utc)
        period_clean = str(period).strip().lower()

        if period_clean in ('today',):
            days_count = 1
            start_date = datetime(now.year, now.month, now.day, 0, 0, 0)
            offset_days = 0
        elif period_clean in ('last week', 'last_week'):
            days_count = 7
            offset_days = 7
        elif period_clean in ('2 weeks ago', '2_weeks_ago', 'two weeks ago'):
            days_count = 7
            offset_days = 14
        elif period_clean in ('this month', 'this_month'):
            days_count = 30
            offset_days = 0
        else:
            # Default 'This Week' (last 7 days)
            days_count = 7
            offset_days = 0

        chart_data = []
        for i in range(days_count - 1, -1, -1):
            target_date = now - timedelta(days=i + offset_days)
            day_start = datetime(target_date.year, target_date.month, target_date.day, 0, 0, 0)
            day_end = datetime(target_date.year, target_date.month, target_date.day, 23, 59, 59)

            # Query count of bus_alerts on this day
            b_count = db.session.query(func.count(BusAlertModel.bus_alert_id)).filter(
                and_(
                    BusAlertModel.alert_time >= day_start,
                    BusAlertModel.alert_time <= day_end
                )
            ).scalar() or 0

            # Query count of roadside_alerts on this day
            r_count = db.session.query(func.count(RoadsideAlertModel.roadside_alert_id)).filter(
                and_(
                    RoadsideAlertModel.alert_time >= day_start,
                    RoadsideAlertModel.alert_time <= day_end
                )
            ).scalar() or 0

            chart_data.append({
                'day': target_date.strftime('%d %b'),
                'date': target_date.strftime('%Y-%m-%d'),
                'busAlerts': b_count,
                'uturnAlerts': r_count,
                'totalAlerts': b_count + r_count
            })

        return {
            'period': period,
            'chartData': chart_data,
            'totalBusAlerts': sum(item['busAlerts'] for item in chart_data),
            'totalUTurnAlerts': sum(item['uturnAlerts'] for item in chart_data),
            'grandTotal': sum(item['totalAlerts'] for item in chart_data)
        }

    def get_system_status(self):
        """
        Evaluates overall system operational status and returns current server timestamp.
        """
        total_devices = db.session.query(func.count(DeviceRegistryModel.device_id)).scalar() or 0
        online_devices = db.session.query(func.count(DeviceRegistryModel.device_id)).filter(
            DeviceRegistryModel.status == 'Online'
        ).scalar() or 0
        maintenance_devices = db.session.query(func.count(DeviceRegistryModel.device_id)).filter(
            DeviceRegistryModel.status == 'Maintenance'
        ).scalar() or 0

        now = datetime.now()
        last_updated_str = now.strftime('%d %b %Y, %I:%M %p')

        if total_devices == 0:
            status_text = "System Initializing"
            is_operational = True
        elif maintenance_devices > 0:
            status_text = f"Maintenance in Progress ({maintenance_devices} device{'s' if maintenance_devices > 1 else ''})"
            is_operational = False
        elif online_devices > 0:
            status_text = "All Systems Operational"
            is_operational = True
        else:
            status_text = "All Systems Operational"
            is_operational = True

        return {
            'statusText': status_text,
            'isOperational': is_operational,
            'onlineDevices': online_devices,
            'totalDevices': total_devices,
            'lastUpdated': last_updated_str,
            'timestampIso': now.isoformat()
        }
