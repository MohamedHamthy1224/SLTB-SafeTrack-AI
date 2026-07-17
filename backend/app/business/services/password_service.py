from app.data.database import bcrypt

class PasswordService:

    @staticmethod
    def hash_password(plain_password):
        if not plain_password or len(plain_password) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        return bcrypt.generate_password_hash(plain_password).decode('utf-8')

    @staticmethod
    def verify_password(password_hash, plain_password):
        if not password_hash or not plain_password:
            return False
        return bcrypt.check_password_hash(password_hash, plain_password)

    @staticmethod
    def is_bcrypt_hash(hash_str):
        if not hash_str:
            return False
        return hash_str.startswith("$2b$") or hash_str.startswith("$2a$") or hash_str.startswith("$2y$")
