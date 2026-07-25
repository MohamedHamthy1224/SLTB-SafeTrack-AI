from app.data.repositories.base_repository import BaseRepository
from app.data.models.role_model import RoleModel
from app.data.database import db

class RoleRepository(BaseRepository):
    """
    Read-only repository for role reference data.
    Does NOT modify or update shared roles records.
    """

    def get_by_id(self, entity_id):
        return db.session.query(RoleModel).filter(RoleModel.role_id == entity_id).first()

    def get_all(self):
        return db.session.query(RoleModel).all()

    def get_by_name(self, role_name):
        return db.session.query(RoleModel).filter(RoleModel.role_name == role_name).first()

    def create(self, data, *args, **kwargs):
        raise NotImplementedError("RoleRepository is read-only for user profile operations.")

    def update(self, entity_id, data, *args, **kwargs):
        raise NotImplementedError("RoleRepository is read-only for user profile operations.")

    def delete(self, entity_id, *args, **kwargs):
        raise NotImplementedError("RoleRepository is read-only for user profile operations.")
