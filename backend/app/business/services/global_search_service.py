from functools import singledispatchmethod
from app.domain.entities.search_criteria import SearchCriteria
from app.business.strategies.linear_search_strategy import LinearSearchStrategy
from app.business.strategies.binary_search_strategy import BinarySearchStrategy
from app.data.models.bus_model import BusModel
from app.data.models.driver_model import DriverModel
from app.data.models.route_model import RouteModel

class GlobalSearchService:
    """
    GlobalSearchService providing unified searching across Buses, Drivers, and Routes.
    Uses Python's functools.singledispatchmethod as the type-based overload-style mechanism.
    """

    def __init__(self, linear_strategy=None, binary_strategy=None):
        self.linear_strategy = linear_strategy or LinearSearchStrategy()
        self.binary_strategy = binary_strategy or BinarySearchStrategy()

    # Note: singledispatchmethod is Python's type-based overload-style mechanism.
    @singledispatchmethod
    def search(self, value):
        raise TypeError(f"Unsupported search input type: {type(value)}")

    @search.register
    def _(self, value: str):
        """String search: Executes manual Linear Search O(n) for partial text matching."""
        query_str = value.strip().lower()
        if not query_str:
            return []

        buses = [b.to_dict() for b in BusModel.query.all()]
        drivers = [d.to_dict() for d in DriverModel.query.all()]
        routes = [r.to_dict() for r in RouteModel.query.all()]

        bus_results = self.linear_strategy.search(buses, query_str)
        driver_results = self.linear_strategy.search(drivers, query_str)
        route_results = self.linear_strategy.search(routes, query_str)

        combined = []
        for b in bus_results:
            combined.append({'type': 'Bus', 'title': f"Bus {b['bus_number']}", 'subtitle': f"Reg: {b['registration_number']} | Depot: {b.get('depot', 'N/A')}", 'data': b})
        for d in driver_results:
            combined.append({'type': 'Driver', 'title': d['full_name'], 'subtitle': f"License: {d['license_number']} | Exp: {d['experience_years']} yrs", 'data': d})
        for r in route_results:
            combined.append({'type': 'Route', 'title': f"Route {r['route_number']} - {r['route_name']}", 'subtitle': f"{r['start_location']} to {r['end_location']} ({r['distance_km']} km)", 'data': r})

        return combined

    @search.register
    def _(self, value: int):
        """Integer search: Executes manual Binary Search O(log n) for exact ID matches."""
        target_id = value
        buses = sorted([b.to_dict() for b in BusModel.query.all()], key=lambda x: x['bus_id'])
        bus_match = self.binary_strategy.search(buses, target_id, key_field='bus_id')
        
        drivers = sorted([d.to_dict() for d in DriverModel.query.all()], key=lambda x: x['driver_id'])
        driver_match = self.binary_strategy.search(drivers, target_id, key_field='driver_id')

        routes = sorted([r.to_dict() for r in RouteModel.query.all()], key=lambda x: x['route_id'])
        route_match = self.binary_strategy.search(routes, target_id, key_field='route_id')

        results = []
        if bus_match:
            results.append({'type': 'Bus', 'title': f"Bus {bus_match[0]['bus_number']}", 'subtitle': f"ID: {target_id}", 'data': bus_match[0]})
        if driver_match:
            results.append({'type': 'Driver', 'title': driver_match[0]['full_name'], 'subtitle': f"ID: {target_id}", 'data': driver_match[0]})
        if route_match:
            results.append({'type': 'Route', 'title': f"Route {route_match[0]['route_number']}", 'subtitle': f"ID: {target_id}", 'data': route_match[0]})

        return results

    @search.register
    def _(self, value: SearchCriteria):
        """SearchCriteria search: Filtered category search using structured criteria."""
        if value.category == 'bus':
            buses = [b.to_dict() for b in BusModel.query.all()]
            matches = self.linear_strategy.search(buses, value.query)
            return [{'type': 'Bus', 'title': b['bus_number'], 'subtitle': b['registration_number'], 'data': b} for b in matches[:value.limit]]
        elif value.category == 'driver':
            drivers = [d.to_dict() for d in DriverModel.query.all()]
            matches = self.linear_strategy.search(drivers, value.query)
            return [{'type': 'Driver', 'title': d['full_name'], 'subtitle': d['license_number'], 'data': d} for d in matches[:value.limit]]
        else:
            return self.search(value.query)[:value.limit]
