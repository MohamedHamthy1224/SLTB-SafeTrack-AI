from abc import ABC, abstractmethod

class SortStrategy(ABC):

    @abstractmethod
    def sort(self, items, key_field=None, reverse=False):
        """
        Abstract sort execution contract.
        :param items: List of dictionary or object items
        :param key_field: Dict key or attribute name to sort by
        :param reverse: True for descending, False for ascending
        :return: Sorted list of items
        """
        pass
