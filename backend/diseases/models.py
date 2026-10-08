from django.db import models


class Disease(models.Model):
    """
    Extended disease catalog model.
    List-type fields (symptoms, risk_factors, causes, prevention, treatment,
    when_to_see_doctor) are stored as JSON arrays of strings for flexibility
    without requiring extra database tables.
    """
    name = models.CharField(max_length=255, unique=True)
    recommended_specialist = models.CharField(max_length=255, blank=True, null=True)

    # Short card description (used on /diseases list page)
    description = models.TextField(help_text='Short description shown on disease list cards.')

    # Detailed rich content fields
    detailed_description = models.TextField(
        blank=True, null=True,
        help_text='Full overview / "What is this disease?" section.'
    )
    symptoms = models.JSONField(
        default=list, blank=True,
        help_text='List of common symptom strings.'
    )
    risk_factors = models.JSONField(
        default=list, blank=True,
        help_text='List of risk factor strings or {"title":..., "description":...} objects.'
    )
    causes = models.JSONField(
        default=list, blank=True,
        help_text='List of cause strings.'
    )
    prevention = models.JSONField(
        default=list, blank=True,
        help_text='List of prevention / healthy habit strings.'
    )
    treatment = models.JSONField(
        default=list, blank=True,
        help_text='Treatment / management information as a list of strings.'
    )
    when_to_see_doctor = models.TextField(
        blank=True, null=True,
        help_text='When should the patient consult a doctor?'
    )
    additional_info = models.TextField(
        blank=True, null=True,
        help_text='Any extra notes, disclaimers, or supplementary information.'
    )

    # Legacy fields kept for backwards compatibility with predictions app
    precautions = models.TextField(blank=True, null=True)
    risk_message = models.TextField(blank=True, null=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Symptom(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
