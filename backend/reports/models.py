from django.conf import settings
from django.db import models

from core.models import TimeStampedModel


class Report(TimeStampedModel):
    class ReportType(models.TextChoices):
        MONTHLY = "monthly", "Monthly"
        ANNUAL = "annual", "Annual"

    title = models.CharField(max_length=200)
    report_type = models.CharField(max_length=10, choices=ReportType.choices)
    period_start = models.DateField()
    period_end = models.DateField()
    summary_data = models.JSONField(default=dict, blank=True)
    generated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="generated_reports"
    )
    file = models.FileField(upload_to="reports/", null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
