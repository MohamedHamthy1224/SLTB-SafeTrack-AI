class SearchCriteria:
    def __init__(self, query="", category="all", limit=10, sort_field=None, sort_order="asc"):
        self.query = str(query).strip() if query else ""
        self.category = category
        self.limit = limit
        self.sort_field = sort_field
        self.sort_order = sort_order

    def to_dict(self):
        return {
            'query': self.query,
            'category': self.category,
            'limit': self.limit,
            'sort_field': self.sort_field,
            'sort_order': self.sort_order
        }
