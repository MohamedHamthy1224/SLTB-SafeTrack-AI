from app.domain.entities.theme_preference import ThemePreference

class UserSettings:

    def __init__(self, user_id=None, theme_preference='light'):
        self._user_id = user_id
        self._theme_preference = ThemePreference(theme_preference)

    @property
    def user_id(self):
        return self._user_id

    @user_id.setter
    def user_id(self, val):
        self._user_id = val

    @property
    def theme_preference(self):
        return self._theme_preference.value

    @theme_preference.setter
    def theme_preference(self, val):
        self._theme_preference = ThemePreference(val)

    def to_dict(self):
        return {
            'user_id': self._user_id,
            'theme_preference': self._theme_preference.value
        }
