class ReportFilterValidator:

    @staticmethod
    def validate_buses_filters(args):
        service_type = args.get('service_type', 'all')
        depot = args.get('depot', 'all')
        status = args.get('status', 'all')
        page = args.get('page', 1)
        per_page = args.get('per_page', 10)
        sort_by = args.get('sort_by', 'bus_id')
        order = args.get('order', 'asc')

        return {
            'page': page,
            'per_page': per_page,
            'sort_by': sort_by,
            'order': order,
            'filters': {
                'service_type': service_type,
                'depot': depot,
                'status': status
            }
        }

    @staticmethod
    def validate_routes_filters(args):
        status = args.get('status', 'all')
        page = args.get('page', 1)
        per_page = args.get('per_page', 10)
        sort_by = args.get('sort_by', 'route_id')
        order = args.get('order', 'asc')

        return {
            'page': page,
            'per_page': per_page,
            'sort_by': sort_by,
            'order': order,
            'filters': {
                'status': status
            }
        }

    @staticmethod
    def validate_drivers_filters(args):
        gender = args.get('gender', 'all')
        status = args.get('status', 'all')
        experience_years = args.get('experience_years', 'all')
        page = args.get('page', 1)
        per_page = args.get('per_page', 10)
        sort_by = args.get('sort_by', 'driver_id')
        order = args.get('order', 'asc')

        return {
            'page': page,
            'per_page': per_page,
            'sort_by': sort_by,
            'order': order,
            'filters': {
                'gender': gender,
                'status': status,
                'experience_years': experience_years
            }
        }

    @staticmethod
    def validate_assignment_filters(args):
        bus_id = args.get('bus_id', 'all')
        driver_id = args.get('driver_id', 'all')
        route_id = args.get('route_id', 'all')
        page = args.get('page', 1)
        per_page = args.get('per_page', 10)
        sort_by = args.get('sort_by', 'assignment_history_id')
        order = args.get('order', 'asc')

        return {
            'page': page,
            'per_page': per_page,
            'sort_by': sort_by,
            'order': order,
            'filters': {
                'bus_id': bus_id,
                'driver_id': driver_id,
                'route_id': route_id
            }
        }

    @staticmethod
    def validate_alert_filters(args):
        bus_id = args.get('bus_id', 'all')
        page = args.get('page', 1)
        per_page = args.get('per_page', 10)
        sort_by = args.get('sort_by', 'bus_alert_id')
        order = args.get('order', 'asc')

        return {
            'page': page,
            'per_page': per_page,
            'sort_by': sort_by,
            'order': order,
            'filters': {
                'bus_id': bus_id
            }
        }
