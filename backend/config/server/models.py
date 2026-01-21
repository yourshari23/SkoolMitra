from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone

class Admin(models.Model):
    username = models.CharField(max_length=30, unique=True)
    password = models.CharField(max_length=155)
    is_active = models.BooleanField(default=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    
    def __str__(self):
        return "System Admin"

class Course(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Batch(models.Model):
    STATUS_CHOICES = [
        ("UPCOMING", "Upcoming"),
        ("ONGOING", "Ongoing"),
        ("COMPLETED", "Completed"),
    ]

    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="batches"
    )

    start_date = models.CharField(max_length=20)
    end_date = models.CharField(max_length=20,null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="UPCOMING"
    )

    is_active = models.BooleanField(default=True)

    def update_status(self):
        today = timezone.now().date()

        if str(today) < self.start_date:
            self.status = "UPCOMING"
        elif self.end_date and str(today)> self.end_date:
            self.status = "COMPLETED"
        else:
            self.status = "ONGOING"
    
    def save(self, *args, **kwargs):
        self.update_status()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.course.name})"

class Counselor(models.Model):
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=155)

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.name

class Student(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    counselor = models.ForeignKey(
        Counselor,
        on_delete=models.PROTECT,
        related_name="students"
    )
    batch = models.ForeignKey(
        Batch,
        on_delete=models.PROTECT,
        related_name="students"
    )

    joined_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Report(models.Model):
    REPORT_TYPES = [
        ('PROGRESS', 'Progress'),
        ('DISCIPLINE', 'Discipline'),
        ('DROPOUT', 'Dropout'),
    ]
    # STATUS_CHOICES = [
    #     ('PENDING', 'Pending'),
    #     ('REVIEWED', 'Reviewed'),
    # ]

    type = models.CharField(max_length=20, choices=REPORT_TYPES)
    student_name = models.CharField(max_length=100)
    course = models.CharField(max_length=100)

    performance_level = models.CharField(max_length=20, null=True, blank=True)
    issue_type = models.CharField(max_length=50, null=True, blank=True)
    risk_level = models.CharField(max_length=20, null=True, blank=True)

    remarks = models.TextField()
    admin_response = models.TextField(null=True, blank=True)
    # status = models.CharField(
    #     max_length=20,
    #     choices=STATUS_CHOICES,
    #     default="PENDING"
    # )

    counselor = models.ForeignKey(Counselor, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} - {self.student_name}"