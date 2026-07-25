class PasswordChangeData:
    def __init__(self, current_password: str = "", new_password: str = "", confirm_password: str = ""):
        self.current_password = current_password
        self.new_password = new_password
        self.confirm_password = confirm_password

    def to_dict(self):
        return {
            'current_password': self.current_password,
            'new_password': self.new_password,
            'confirm_password': self.confirm_password
        }
