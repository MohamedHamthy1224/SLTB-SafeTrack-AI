from app.data.repositories.activity_log_repository import ActivityLogRepository

class ActivityLogService:

    def __init__(self, activity_repo=None):
        self.activity_repo = activity_repo or ActivityLogRepository()

    def log_activity(self, user_id, activity_desc):
        return self.activity_repo.create({'user_id': user_id, 'activity': activity_desc})

    def get_recent_logs(self, limit=10):
        return self.activity_repo.get_recent_logs(limit)
