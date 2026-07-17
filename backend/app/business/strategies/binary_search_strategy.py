from app.business.strategies.search_strategy import SearchStrategy

class BinarySearchStrategy(SearchStrategy):
    """
    Binary Search Strategy Implementation.
    Time Complexity: O(log n) where n is the number of elements in the sorted collection.
    Space Complexity: O(1) iterative array partitioning.
    
    Requires candidate elements to be pre-sorted by key_field. Performs exact matching
    on registration numbers, bus numbers, route numbers, or exact numeric IDs.
    """

    def search(self, items, query, key_field=None):
        if not items or query is None or not key_field:
            return []

        search_target = str(query).strip().lower()
        low = 0
        high = len(items) - 1

        while low <= high:
            mid = (low + high) // 2
            item = items[mid]
            val = item.get(key_field) if isinstance(item, dict) else getattr(item, key_field, None)
            
            val_str = str(val).strip().lower() if val is not None else ""

            if val_str == search_target:
                return [item]
            elif val_str < search_target:
                low = mid + 1
            else:
                high = mid - 1

        return []
