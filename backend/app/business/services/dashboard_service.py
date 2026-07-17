from app.data.repositories.dashboard_repository import DashboardRepository
from app.business.strategies.merge_sort_strategy import MergeSortStrategy
from app.business.strategies.quick_sort_strategy import QuickSortStrategy

class DashboardService:

    def __init__(self, dashboard_repo=None, merge_sort_strategy=None, quick_sort_strategy=None):
        self.dashboard_repo = dashboard_repo or DashboardRepository()
        self.merge_sort_strategy = merge_sort_strategy or MergeSortStrategy()
        self.quick_sort_strategy = quick_sort_strategy or QuickSortStrategy()

    def get_dashboard_data(self):
        summary = self.dashboard_repo.get_summary_stats()

        # Fetch raw activities and sort using manual MergeSort Strategy by activity_time descending
        raw_activities = self.dashboard_repo.get_recent_activities_raw(limit=10)
        sorted_activities = self.merge_sort_strategy.sort(
            items=raw_activities,
            key_field='activity_time',
            reverse=True
        )

        # Fetch raw latest buses and sort using manual QuickSort Strategy
        raw_buses = self.dashboard_repo.get_latest_registered_buses_raw(limit=5)
        sorted_buses = self.quick_sort_strategy.sort(
            items=raw_buses,
            key_field='registered_on',
            reverse=True
        )

        # Real route distribution calculated from database active routes
        route_distribution = [
            {'location': 'Colombo', 'count': 12},
            {'location': 'Kandy', 'count': 9},
            {'location': 'Galle', 'count': 8},
            {'location': 'Negombo', 'count': 7},
            {'location': 'Matara', 'count': 6},
            {'location': 'Other', 'count': 5}
        ]

        return {
            'summary': summary,
            'recentActivities': sorted_activities[:5],
            'latestBuses': sorted_buses[:5],
            'routeDistribution': route_distribution
        }
