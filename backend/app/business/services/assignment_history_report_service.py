from app.data.repositories.assignment_history_report_repository import AssignmentHistoryReportRepository
from app.domain.entities.report_criteria import ReportCriteria

class AssignmentHistoryReportService:

    def __init__(self, repository=None):
        self.repository = repository or AssignmentHistoryReportRepository()

    def get_assignment_history_report(self, params):
        criteria = ReportCriteria(
            page=params.get('page', 1),
            per_page=params.get('per_page', 10),
            sort_by=params.get('sort_by', 'assignment_history_id'),
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

    def get_export_data(self, params):
        filters = params.get('filters', {})
        sort_by = params.get('sort_by', 'assignment_history_id')
        order = params.get('order', 'asc')
        return self.repository.get_all_filtered_for_export(filters, sort_by=sort_by, order=order)
