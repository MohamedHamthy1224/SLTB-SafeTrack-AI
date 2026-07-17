from abc import ABC, abstractmethod

class BaseAuthenticationService(ABC):

    @abstractmethod
    def authenticate(self, identifier, password):
        pass

    @abstractmethod
    def authorize_role(self, user):
        pass
