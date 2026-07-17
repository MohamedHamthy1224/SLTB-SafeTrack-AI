from flask import jsonify

class ResponseFactory:

    @staticmethod
    def success(data=None, message="Operation completed successfully.", status_code=200):
        response = {
            "success": True,
            "message": message,
            "data": data if data is not None else {}
        }
        return jsonify(response), status_code

    @staticmethod
    def error(message="An error occurred.", errors=None, status_code=400):
        response = {
            "success": False,
            "message": message
        }
        if errors:
            response["errors"] = errors
        return jsonify(response), status_code
