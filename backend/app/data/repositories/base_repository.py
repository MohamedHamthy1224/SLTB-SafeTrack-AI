from abc import ABC, abstractmethod
from typing import Any

class BaseRepository(ABC):

    @abstractmethod
    def get_by_id(self, entity_id: Any) -> Any:
        pass

    @abstractmethod
    def get_all(self) -> Any:
        pass

    @abstractmethod
    def create(self, data: Any, *args: Any, **kwargs: Any) -> Any:
        pass

    @abstractmethod
    def update(self, entity_id: Any, data: Any, *args: Any, **kwargs: Any) -> Any:
        pass

    @abstractmethod
    def delete(self, entity_id: Any, *args: Any, **kwargs: Any) -> Any:
        pass
