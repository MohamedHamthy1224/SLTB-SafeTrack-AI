from abc import ABC, abstractmethod
from typing import Any, Dict

class BaseValidator(ABC):

    @abstractmethod
    def validate(self, data: Any, *args: Any, **kwargs: Any) -> Dict[str, str]:
        """Must return a dictionary of errors. Empty dictionary indicates validation success."""
        pass
