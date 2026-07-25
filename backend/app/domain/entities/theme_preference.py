class ThemePreference:
    ALLOWED_THEMES = ('light', 'dark', 'system')

    def __init__(self, value='light'):
        self._value = 'light'
        self.value = value

    @property
    def value(self):
        return self._value

    @value.setter
    def value(self, val):
        if not val or str(val).strip().lower() not in self.ALLOWED_THEMES:
            raise ValueError(f"Invalid theme preference '{val}'. Must be one of {self.ALLOWED_THEMES}.")
        self._value = str(val).strip().lower()

    def __str__(self):
        return self._value

    def __repr__(self):
        return f"<ThemePreference(value='{self._value}')>"
