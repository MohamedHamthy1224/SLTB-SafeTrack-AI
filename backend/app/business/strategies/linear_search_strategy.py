from typing import Any, List, Optional
from app.business.strategies.search_strategy import SearchStrategy

class LinearSearchStrategy(SearchStrategy):
    """
    Linear Search Strategy Implementation.
    Time Complexity: O(n) where n is the number of candidate items in the collection.
    Space Complexity: O(k) where k is the number of matching items.
    
    Iterates sequentially through the list of dictionary items or objects and performs 
    case-insensitive partial string or exact property comparison.
    """

    def search(self, items: Any, query: Any, key_field: Optional[str] = None) -> List[Any]:
        if not items or query is None:
            return []

        search_term = str(query).strip().lower()
        if not search_term:
            return items

        results = []
        for item in items:
            if key_field:
                val = item.get(key_field) if isinstance(item, dict) else getattr(item, key_field, None)
                if val is not None and search_term in str(val).lower():
                    results.append(item)
            else:
                # Search across all string fields if no specific key_field provided
                matched = False
                fields = item.values() if isinstance(item, dict) else vars(item).values()
                for val in fields:
                    if val is not None and search_term in str(val).lower():
                        matched = True
                        break
                if matched:
                    results.append(item)

        return results
