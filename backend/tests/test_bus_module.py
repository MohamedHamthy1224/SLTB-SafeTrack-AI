import unittest
from app.domain.entities.bus import Bus
from app.domain.entities.bus_assignment import BusAssignment
from app.domain.entities.search_criteria import SearchCriteria
from app.business.strategies.linear_search_strategy import LinearSearchStrategy
from app.business.strategies.binary_search_strategy import BinarySearchStrategy
from app.business.strategies.quick_sort_strategy import QuickSortStrategy
from app.business.strategies.merge_sort_strategy import MergeSortStrategy
from app.business.validators.bus_validator import BusValidator

class TestBusModule(unittest.TestCase):

    def test_bus_entity_encapsulation_and_total_capacity(self):
        bus = Bus(
            bus_id=1,
            bus_number="SLTB-100",
            registration_number="NB-1000",
            capacity=50,
            standing_capacity=20,
            status="Active"
        )
        self.assertEqual(bus.bus_id, 1)
        self.assertEqual(bus.bus_number, "SLTB-100")
        self.assertEqual(bus.registration_number, "NB-1000")
        self.assertEqual(bus.capacity, 50)
        self.assertEqual(bus.standing_capacity, 20)
        self.assertEqual(bus.total_capacity, 70)

        with self.assertRaises(ValueError):
            bus.capacity = 0

        with self.assertRaises(ValueError):
            bus.standing_capacity = -5

    def test_bus_assignment_entity(self):
        assignment = BusAssignment(
            assignment_id=10,
            bus_id=1,
            driver_id=2,
            route_id=3,
            status="Active"
        )
        self.assertEqual(assignment.assignment_id, 10)
        self.assertEqual(assignment.bus_id, 1)
        self.assertEqual(assignment.driver_id, 2)
        self.assertEqual(assignment.route_id, 3)
        self.assertEqual(assignment.status, "Active")

    def test_quick_sort_strategy(self):
        strategy = QuickSortStrategy()
        items = [
            {'bus_number': 'SLTB-050', 'capacity': 40},
            {'bus_number': 'SLTB-010', 'capacity': 55},
            {'bus_number': 'SLTB-030', 'capacity': 50}
        ]
        sorted_asc = strategy.sort(items, key_field='bus_number', reverse=False)
        self.assertEqual([i['bus_number'] for i in sorted_asc], ['SLTB-010', 'SLTB-030', 'SLTB-050'])

        sorted_desc = strategy.sort(items, key_field='capacity', reverse=True)
        self.assertEqual([i['capacity'] for i in sorted_desc], [55, 50, 40])

    def test_merge_sort_strategy(self):
        strategy = MergeSortStrategy()
        items = [
            {'route_number': '154', 'route_name': 'Colombo to Trinco'},
            {'route_number': '101', 'route_name': 'Colombo to Kandy'},
            {'route_number': '112', 'route_name': 'Kandy to Matale'}
        ]
        sorted_items = strategy.sort(items, key_field='route_number')
        self.assertEqual([i['route_number'] for i in sorted_items], ['101', '112', '154'])

    def test_linear_search_strategy(self):
        strategy = LinearSearchStrategy()
        items = [
            {'bus_number': 'SLTB-001', 'model': 'Ashok Leyland'},
            {'bus_number': 'SLTB-002', 'model': 'TATA Starbus'},
            {'bus_number': 'SLTB-003', 'model': 'Ashok Leyland'}
        ]
        matches = strategy.search(items, query='Ashok', key_field='model')
        self.assertEqual(len(matches), 2)

    def test_binary_search_strategy(self):
        strategy = BinarySearchStrategy()
        items = [
            {'bus_id': 1, 'bus_number': 'SLTB-001'},
            {'bus_id': 5, 'bus_number': 'SLTB-005'},
            {'bus_id': 10, 'bus_number': 'SLTB-010'}
        ]
        match = strategy.search(items, query=5, key_field='bus_id')
        self.assertEqual(len(match), 1)
        self.assertEqual(match[0]['bus_number'], 'SLTB-005')

    def test_bus_validator_rules(self):
        validator = BusValidator()
        invalid_data = {
            'bus_number': '',
            'registration_number': '',
            'service_type': 'Invalid Type',
            'capacity': 0,
            'standing_capacity': -1,
            'fuel_type': 'Kerosene',
            'status': 'Unknown'
        }
        errors = validator.validate(invalid_data)
        self.assertIn('bus_number', errors)
        self.assertIn('registration_number', errors)
        self.assertIn('service_type', errors)
        self.assertIn('capacity', errors)
        self.assertIn('standing_capacity', errors)
        self.assertIn('fuel_type', errors)
        self.assertIn('status', errors)

if __name__ == '__main__':
    unittest.main()
