from app.business.strategies.sort_strategy import SortStrategy

class MergeSortStrategy(SortStrategy):
    """
    Merge Sort Algorithm Implementation.
    Time Complexity: O(n log n) in all cases (worst, average, best).
    Space Complexity: O(n) auxiliary memory for subarray merging.
    
    A stable divide-and-conquer algorithm ideal for activity timestamps and candidate array preparation.
    """

    def sort(self, items, key_field=None, reverse=False):
        if not items or len(items) <= 1:
            return list(items) if items else []

        arr = list(items)
        sorted_arr = self._merge_sort_recursive(arr, key_field)
        if reverse:
            sorted_arr.reverse()
        return sorted_arr

    def _merge_sort_recursive(self, arr, key_field):
        if len(arr) <= 1:
            return arr

        mid = len(arr) // 2
        left = self._merge_sort_recursive(arr[:mid], key_field)
        right = self._merge_sort_recursive(arr[mid:], key_field)

        return self._merge(left, right, key_field)

    def _merge(self, left, right, key_field):
        result = []
        i = j = 0

        while i < len(left) and j < len(right):
            val_left = self._get_key(left[i], key_field)
            val_right = self._get_key(right[j], key_field)

            if val_left <= val_right:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1

        result.extend(left[i:])
        result.extend(right[j:])
        return result

    def _get_key(self, item, key_field):
        if not key_field:
            return str(item)
        val = item.get(key_field) if isinstance(item, dict) else getattr(item, key_field, None)
        return str(val) if val is not None else ""
