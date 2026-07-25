import os
import uuid
from datetime import datetime, timezone
from werkzeug.utils import secure_filename
from app.business.validators.profile_photo_validator import ProfilePhotoValidator

class ProfilePhotoError(Exception):
    def __init__(self, message, errors=None, status_code=400):
        super().__init__(message)
        self.message = message
        self.errors = errors or {}
        self.status_code = status_code

class ProfilePhotoService:

    def __init__(self):
        self.validator = ProfilePhotoValidator()

    def save_photo(self, file):
        if not file or not getattr(file, 'filename', None):
            return None

        val_errors = self.validator.validate(file)
        if val_errors:
            raise ProfilePhotoError("Photo validation failed.", errors=val_errors, status_code=400)

        filename = secure_filename(file.filename)
        ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else 'jpg'
        unique_name = f"profile_{uuid.uuid4().hex}_{int(datetime.now(timezone.utc).timestamp())}.{ext}"

        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        upload_dir = os.path.join(base_dir, 'static', 'uploads', 'profiles')
        os.makedirs(upload_dir, exist_ok=True)

        full_path = os.path.join(upload_dir, unique_name)
        file.save(full_path)

        return f"uploads/profiles/{unique_name}"

    def remove_photo_file(self, relative_path):
        if not relative_path or not relative_path.startswith("uploads/profiles/"):
            return
        try:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            full_path = os.path.join(base_dir, 'static', relative_path)
            if os.path.exists(full_path):
                os.remove(full_path)
        except Exception:
            pass
