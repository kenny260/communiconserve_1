from rest_framework.renderers import JSONRenderer


class StandardResponseRenderer(JSONRenderer):
    """Wraps every API response in the project's standard envelope:
    {"status": "success" | "error", "message": str, "data": {...}}
    """

    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get("response") if renderer_context else None
        status_code = response.status_code if response else 200
        is_error = status_code >= 400

        if isinstance(data, dict) and {"status", "message", "data"} <= data.keys():
            envelope = data
        else:
            envelope = {
                "status": "error" if is_error else "success",
                "message": "Request failed" if is_error else "Operation completed successfully",
                "data": data,
            }
        return super().render(envelope, accepted_media_type, renderer_context)
