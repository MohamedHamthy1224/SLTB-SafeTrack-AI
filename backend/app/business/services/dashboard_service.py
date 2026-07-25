from datetime import datetime, timezone
from app.data.repositories.dashboard_repository import DashboardRepository
from app.business.strategies.merge_sort_strategy import MergeSortStrategy
from app.business.strategies.quick_sort_strategy import QuickSortStrategy

class DashboardService:

    def __init__(self, dashboard_repo=None, merge_sort_strategy=None, quick_sort_strategy=None):
        self.dashboard_repo = dashboard_repo or DashboardRepository()
        self.merge_sort_strategy = merge_sort_strategy or MergeSortStrategy()
        self.quick_sort_strategy = quick_sort_strategy or QuickSortStrategy()

    def get_dashboard_overview(self):
        buses_stats = self.dashboard_repo.get_bus_stats()
        routes_stats = self.dashboard_repo.get_route_stats()
        drivers_stats = self.dashboard_repo.get_driver_stats()

        total_buses = buses_stats['total']
        total_routes = routes_stats['total']
        total_drivers = drivers_stats['total']

        # 1. Buses by Status
        buses_by_status = [
            {
                'status': 'Active',
                'count': buses_stats['active'],
                'percentage': round((buses_stats['active'] / total_buses * 100), 1) if total_buses > 0 else 0.0
            },
            {
                'status': 'Maintenance',
                'count': buses_stats['maintenance'],
                'percentage': round((buses_stats['maintenance'] / total_buses * 100), 1) if total_buses > 0 else 0.0
            },
            {
                'status': 'Inactive',
                'count': buses_stats['inactive'],
                'percentage': round((buses_stats['inactive'] / total_buses * 100), 1) if total_buses > 0 else 0.0
            }
        ]

        # 2. Buses by Service Type
        raw_service_types = self.dashboard_repo.get_buses_by_service_type_raw()
        buses_by_service_type = []
        for item in raw_service_types:
            cnt = item['count']
            pct = round((cnt / total_buses * 100), 1) if total_buses > 0 else 0.0
            buses_by_service_type.append({
                'serviceType': item['service_type'],
                'count': cnt,
                'percentage': pct
            })
        # Sort service types by count descending
        buses_by_service_type = self.merge_sort_strategy.sort(
            items=buses_by_service_type,
            key_field='count',
            reverse=True
        )

        # 3. Drivers by Status
        drivers_by_status = [
            {
                'status': 'Active',
                'count': drivers_stats['active'],
                'percentage': round((drivers_stats['active'] / total_drivers * 100), 1) if total_drivers > 0 else 0.0
            },
            {
                'status': 'Inactive',
                'count': drivers_stats['inactive'],
                'percentage': round((drivers_stats['inactive'] / total_drivers * 100), 1) if total_drivers > 0 else 0.0
            }
        ]

        # 4. Buses by Fuel Type
        raw_fuel_types = self.dashboard_repo.get_buses_by_fuel_type_raw()
        fuel_map = {item['fuel_type']: item['count'] for item in raw_fuel_types}

        standard_fuel_types = ['Diesel', 'Petrol', 'Electric', 'Hybrid', 'CNG']
        buses_by_fuel_type = []
        accounted_fuel_count = 0

        for ft in standard_fuel_types:
            cnt = fuel_map.get(ft, 0)
            accounted_fuel_count += cnt
            pct = round((cnt / total_buses * 100), 1) if total_buses > 0 else 0.0
            buses_by_fuel_type.append({
                'fuelType': ft,
                'count': cnt,
                'percentage': pct
            })

        # Check for unlisted or NULL fuel types
        other_fuel_count = total_buses - accounted_fuel_count
        if other_fuel_count > 0:
            buses_by_fuel_type.append({
                'fuelType': 'Not Specified',
                'count': other_fuel_count,
                'percentage': round((other_fuel_count / total_buses * 100), 1) if total_buses > 0 else 0.0
            })

        # 5. Top 5 Routes by Distance
        raw_routes = self.dashboard_repo.get_routes_for_distance_sorting()
        sorted_routes = self.merge_sort_strategy.sort(
            items=raw_routes,
            key_field='distance_km',
            reverse=True
        )
        top_5_routes = sorted_routes[:5]

        # 6. Buses by Manufacture Year
        raw_years = self.dashboard_repo.get_buses_by_manufacture_year_raw()
        buckets = {
            '2015 & Below': 0,
            '2016 - 2018': 0,
            '2019 - 2021': 0,
            '2022 - 2024': 0,
            '2025 & Above': 0,
            'Not Specified': 0
        }

        for y_item in raw_years:
            yr = y_item['year']
            cnt = y_item['count']
            if yr is None:
                buckets['Not Specified'] += cnt
            elif yr <= 2015:
                buckets['2015 & Below'] += cnt
            elif 2016 <= yr <= 2018:
                buckets['2016 - 2018'] += cnt
            elif 2019 <= yr <= 2021:
                buckets['2019 - 2021'] += cnt
            elif 2022 <= yr <= 2024:
                buckets['2022 - 2024'] += cnt
            else:
                buckets['2025 & Above'] += cnt

        buses_by_manufacture_year = []
        bucket_order = ['2015 & Below', '2016 - 2018', '2019 - 2021', '2022 - 2024', '2025 & Above']
        if buckets['Not Specified'] > 0:
            bucket_order.append('Not Specified')

        for b_name in bucket_order:
            buses_by_manufacture_year.append({
                'year_range': b_name,
                'count': buckets[b_name]
            })

        generated_at = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S')

        return {
            'buses': buses_stats,
            'routes': routes_stats,
            'drivers': drivers_stats,
            'busesByStatus': buses_by_status,
            'busesByServiceType': buses_by_service_type,
            'driversByStatus': drivers_by_status,
            'busesByFuelType': buses_by_fuel_type,
            'topRoutesByDistance': top_5_routes,
            'busesByManufactureYear': buses_by_manufacture_year,
            'generatedAt': generated_at
        }

    def get_dashboard_data(self):
        # Retain method for backwards compatibility with existing controllers
        overview = self.get_dashboard_overview()
        b = overview['buses']
        r = overview['routes']
        d = overview['drivers']
        summary = {
            'totalBuses': b['total'],
            'totalDrivers': d['total'],
            'totalRoutes': r['total'],
            'activeBuses': b['active'],
            'busesInMaintenance': b['maintenance'],
            'inactiveBuses': b['inactive'],
            'activeDrivers': d['active'],
            'inactiveDrivers': d['inactive'],
            'activeRoutes': r['active'],
            'inactiveRoutes': r['inactive']
        }
        return {
            'summary': summary,
            'overview': overview
        }
