class ReportCriteria:
    """
    Encapsulates pagination parameters, sorting fields, sort order, and filter criteria
    for report data retrieval.
    Encapsulation pattern with protected attributes and validated properties.
    """
    def __init__(self, page=1, per_page=10, sort_by=None, order='asc', filters=None):
        self._page = self._sanitize_int(page, default=1, min_val=1)
        self._per_page = self._sanitize_int(per_page, default=10, min_val=1, max_val=100)
        self._sort_by = sort_by
        self._order = order.lower() if order and order.lower() in ('asc', 'desc') else 'asc'
        self._filters = filters if isinstance(filters, dict) else {}

    def _sanitize_int(self, val, default=1, min_val=1, max_val=None):
        try:
            parsed = int(val)
            if parsed < min_val:
                return min_val
            if max_val is not None and parsed > max_val:
                return max_val
            return parsed
        except (ValueError, TypeError):
            return default

    @property
    def page(self):
        return self._page

    @property
    def per_page(self):
        return self._per_page

    @property
    def offset(self):
        return (self._page - 1) * self._per_page

    @property
    def sort_by(self):
        return self._sort_by

    @property
    def order(self):
        return self._order

    @property
    def filters(self):
        return self._filters

    def get_filter(self, key, default=None):
        return self._filters.get(key, default)
