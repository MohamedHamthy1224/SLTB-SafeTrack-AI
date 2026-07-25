from abc import ABC, abstractmethod
from typing import Any, List, Optional

class SearchStrategy(ABC):

    @abstractmethod
    def search(self, items: Any, query: Any, key_field: Optional[str] = None) -> List[Any]:
        """
        Abstract search execution contract.
        :param items: Iterable candidate collection
        :param query: Value or term to search for
        :param key_field: Field name to access on collection dicts/objects
        :return: Matching items list or single item
        """
        pass

