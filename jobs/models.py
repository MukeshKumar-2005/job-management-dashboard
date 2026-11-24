
from django.db import models


class Job(models.Model):

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('requested', 'Requested'),
        ('posted', 'Posted'),
        ('filled', 'Filled'),
    ]

    CATEGORY_CHOICES = [
        ('full_time', 'Full-time'),
        ('part_time', 'Part-time'),
        ('intern', 'Intern'),
    ]

    title = models.CharField(max_length=255)

    profile_picture = models.ImageField(
        upload_to='job_profiles/',
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )

    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES
    )

    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)

    start_date = models.DateField()
    end_date = models.DateField()

    description = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
