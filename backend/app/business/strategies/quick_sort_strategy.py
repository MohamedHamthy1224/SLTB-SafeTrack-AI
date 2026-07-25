from app.business.strategies.sort_strategy import SortStrategy

class QuickSortStrategy(SortStrategy):
    """
    Quick Sort Algorithm Implementation.
    Time Complexity: Average O(n log n), Worst case O(n^2).
    Space Complexity: O(log n) call stack overhead.
    
    In-place partition divide-and-conquer strategy used for sorting buses, routes, and drivers.
    """

    def sort(self, items, key_field=None, reverse=False):
        if not items or len(items) <= 1:
            return list(items) if items else []

        arr = list(items)
        self._quick_sort_recursive(arr, 0, len(arr) - 1, key_field)
        if reverse:
            arr.reverse()
        return arr

    def _quick_sort_recursive(self, arr, low, high, key_field):
        if low < high:
            pivot_idx = self._partition(arr, low, high, key_field)
            self._quick_sort_recursive(arr, low, pivot_idx - 1, key_field)
            self._quick_sort_recursive(arr, pivot_idx + 1, high, key_field)

    def _partition(self, arr, low, high, key_field):
        pivot_val = self._get_key(arr[high], key_field)
        i = low - 1

        for j in range(low, high):
            current_val = self._get_key(arr[j], key_field)
            if current_val <= pivot_val:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]

        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        return i + 1

    def _get_key(self, item, key_field):
        if not key_field:
            val = item
        else:
            val = item.get(key_field) if isinstance(item, dict) else getattr(item, key_field, None)

        if val is None:
            return ""
        if isinstance(val, (int, float)):
            return val
        return str(val).lower()
