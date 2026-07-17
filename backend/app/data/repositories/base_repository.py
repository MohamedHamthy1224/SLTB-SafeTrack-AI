from abc import ABC, abstractmethod

class BaseRepository(ABC):
    
    @abstractmethod
    def get_by_id(self, entity_id):
        pass

    @abstractmethod
    def get_all(self):
        pass

    @abstractmethod
    def create(self, data):
        pass

    @abstractmethod
    def update(self, entity_id, data):
        pass

    @abstractmethod
    def delete(self, entity_id):
        pass
