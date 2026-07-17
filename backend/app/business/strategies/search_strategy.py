from abc import ABC, abstractmethod

class SearchStrategy(ABC):

    @abstractmethod
    def search(self, items, query, key_field=None):
        """
        Abstract search execution contract.
        :param items: Iterable candidate collection
        :param query: Value or term to search for
        :param key_field: Field name to access on collection dicts/objects
        :return: Matching items list or single item
        """
        pass
