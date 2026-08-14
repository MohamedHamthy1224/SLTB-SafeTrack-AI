from app.data.repositories.route_report_repository import RouteReportRepository
from app.domain.entities.report_criteria import ReportCriteria

class RouteReportService:

    def __init__(self, repository=None):
        self.repository = repository or RouteReportRepository()

    def get_routes_report(self, params):
        criteria = ReportCriteria(
            page=params.get('page', 1),
            per_page=params.get('per_page', 10),
            sort_by=params.get('sort_by', 'route_id'),
            order=params.get('order', 'asc'),
            filters=params.get('filters', {})
        )
        report_data = self.repository.get_report_data(criteria)
        summary = self.repository.get_summary()

        return {
            'summary': summary,
            'items': report_data['items'],
            'pagination': report_data['pagination']
        }

    def get_filter_options(self):
        return self.repository.get_filter_options()

    def get_export_data(self, params):
        filters = params.get('filters', {})
        sort_by = params.get('sort_by', 'route_id')
        order = params.get('order', 'asc')
        return self.repository.get_all_filtered_for_export(filters, sort_by=sort_by, order=order)
