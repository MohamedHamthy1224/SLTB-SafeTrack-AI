from app.data.repositories.police_dashboard_repository import PoliceDashboardRepository
from app.data.repositories.activity_log_repository import ActivityLogRepository

class PoliceDashboardService:

    def __init__(self, dashboard_repo=None, activity_log_repo=None):
        self.dashboard_repo = dashboard_repo or PoliceDashboardRepository()
        self.activity_log_repo = activity_log_repo or ActivityLogRepository()

    def get_dashboard_data(self, period='This Week', request_user_id=None):
        """
        Gathers complete live dashboard data payload.
        """
        stats = self.dashboard_repo.get_kpi_stats()
        bus_safety = self.dashboard_repo.get_bus_safety_monitor()
        uturn_safety = self.dashboard_repo.get_uturn_safety_monitor()
        alerts_chart = self.dashboard_repo.get_alerts_overview_chart(period=period)
        system_status = self.dashboard_repo.get_system_status()

        if request_user_id:
            try:
                self.activity_log_repo.log_activity(
                    request_user_id,
                    "Viewed Police Admin Dashboard."
                )
            except Exception:
                pass

        return {
            'statistics': stats,
            'busSafety': bus_safety,
            'uturnSafety': uturn_safety,
            'alertsOverview': alerts_chart,
            'systemStatus': system_status
        }

    def get_alerts_chart(self, period='This Week'):
        """
        Returns dynamic alerts chart filtered by selected period.
        """
        return self.dashboard_repo.get_alerts_overview_chart(period=period)

    def get_safety_monitors(self):
        """
        Returns real-time bus and U-turn safety monitor states.
        """
        return {
            'busSafety': self.dashboard_repo.get_bus_safety_monitor(),
            'uturnSafety': self.dashboard_repo.get_uturn_safety_monitor()
        }
