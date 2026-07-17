from abc import ABC, abstractmethod

class BaseValidator(ABC):

    @abstractmethod
    def validate(self, data):
        """Must return a dictionary of errors. Empty dictionary indicates validation success."""
        pass
