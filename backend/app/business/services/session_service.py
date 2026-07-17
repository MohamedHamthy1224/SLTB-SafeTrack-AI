from app.data.repositories.session_repository import SessionRepository

class SessionService:

    def __init__(self, session_repo=None):
        self.session_repo = session_repo or SessionRepository()

    def end_session(self, session_id):
        if session_id:
            return self.session_repo.close_session(session_id)
        return None
