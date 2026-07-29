from rest_framework import serializers

from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = (
            "id", "title", "report_type", "period_start", "period_end",
            "summary_data", "generated_by", "file", "created_at",
        )
        read_only_fields = ("id", "generated_by", "created_at")
