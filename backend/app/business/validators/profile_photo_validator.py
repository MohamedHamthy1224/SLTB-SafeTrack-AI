from app.business.validators.base_validator import BaseValidator

class ProfilePhotoValidator(BaseValidator):
    ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'webp'}
    ALLOWED_MIME_TYPES = {'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'}
    MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB

    def validate(self, file, *args, **kwargs):
        errors = {}
        if not file or not getattr(file, 'filename', None):
            return errors

        filename = file.filename
        if '.' not in filename or filename.rsplit('.', 1)[1].lower() not in self.ALLOWED_EXTENSIONS:
            errors["profile_picture"] = "Invalid image format. Allowed formats: JPG, JPEG, PNG, GIF, WEBP."

        if getattr(file, 'mimetype', None) and file.mimetype.lower() not in self.ALLOWED_MIME_TYPES:
            errors["profile_picture"] = "Invalid file type. Please upload a valid image."

        try:
            file.seek(0, 2)
            file_length = file.tell()
            file.seek(0)
            if file_length > self.MAX_FILE_SIZE:
                errors["profile_picture"] = "Image file size exceeds maximum limit of 2MB."
        except Exception:
            pass

        return errors
