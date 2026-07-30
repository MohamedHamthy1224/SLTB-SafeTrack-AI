class UserRole:
    """
    Centralized User Role Constants & RBAC Helper Methods.
    Ensures single source of truth across the backend application.
    """
    POLICE_ADMIN = "Police Admin"
    TRAFFIC_POLICE_OFFICER = "Traffic Police Officer"
    SLTB_ADMIN = "SLTB Admin"

    # Extension hooks for future web modules
    DRIVER = "Driver"
    CONDUCTOR = "Conductor"
    MAINTENANCE = "Maintenance"

    # Permitted web application roles
    WEB_PERMITTED_ROLES = {POLICE_ADMIN, SLTB_ADMIN}

    # Mobile-only roles (denied web dashboard access)
    MOBILE_ONLY_ROLES = {TRAFFIC_POLICE_OFFICER}

    # Role to module/dashboard route mapping
    DASHBOARD_ROUTES = {
        SLTB_ADMIN: "/sltb/dashboard",
        POLICE_ADMIN: "/police/dashboard"
    }

    @classmethod
    def is_mobile_only(cls, role_name):
        if not role_name:
            return False
        return role_name in cls.MOBILE_ONLY_ROLES or "Police Officer" in str(role_name)

    @classmethod
    def is_web_permitted(cls, role_name):
        if not role_name:
            return False
        return role_name in cls.WEB_PERMITTED_ROLES
