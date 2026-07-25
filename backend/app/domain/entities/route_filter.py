class RouteFilter:
    """
    RouteFilter Domain Entity for encapsulating query string search and filtering criteria.
    """

    def __init__(
        self,
        search="",
        status="",
        start_location="",
        end_location="",
        page=1,
        per_page=10,
        sort_by="route_number",
        order="asc"
    ):
        self.search = str(search).strip() if search else ""
        self.status = str(status).strip() if status else ""
        self.start_location = str(start_location).strip() if start_location else ""
        self.end_location = str(end_location).strip() if end_location else ""
        
        try:
            self.page = max(1, int(page))
        except (ValueError, TypeError):
            self.page = 1

        try:
            self.per_page = int(per_page) if int(per_page) in (10, 25, 50, 100) else 10
        except (ValueError, TypeError):
            self.per_page = 10

        self.sort_by = str(sort_by).strip() if sort_by else "route_number"
        self.order = str(order).strip().lower() if order and str(order).strip().lower() in ('asc', 'desc') else "asc"

    def to_dict(self):
        return {
            'search': self.search,
            'status': self.status,
            'start_location': self.start_location,
            'end_location': self.end_location,
            'page': self.page,
            'per_page': self.per_page,
            'sort_by': self.sort_by,
            'order': self.order
        }
