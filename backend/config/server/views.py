from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import F
from .models import Admin, Counselor, Batch, Course, Report, Student
import json
from django.db import IntegrityError

# This has a bug need to FIX
@csrf_exempt
def admin(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")
    admin = Admin.objects.filter(is_active=True).first()

    if not admin:
        return JsonResponse({"error": "Admin not configured"}, status=500)

    if admin.username != username:
        return JsonResponse({"error": "Invalid Username"}, status=401)

    if not admin.check_password(password):
        return JsonResponse({"error": "Invalid Password"}, status=401)

    return JsonResponse({"message": "Login Successful", "role": "Admin"}, status=200)

@csrf_exempt
def counselor_login(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return JsonResponse({"error": "Credentials required"}, status=400)

    try:
        counselor = Counselor.objects.get(username=username, is_active=True)
    except Counselor.DoesNotExist:
        return JsonResponse({"error": "Invalid Username"}, status=401)

    if not counselor.check_password(password):
        return JsonResponse({"error": "Invalid Password"}, status=401)

    return JsonResponse({
        "message": "Login successful",
        "counselor_id": counselor.id,
        "name": counselor.name
    }, status=200)

@csrf_exempt
def add_counselor(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    data = json.loads(request.body)

    name = data.get("name")
    username = data.get("username")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")
    
    required = ["name", "username", "email", "phone", "password"]
    if not all(data.get(k) for k in required):
        return JsonResponse({"error": "All fields required"}, status=400)
    
    if Counselor.objects.filter(username=data["username"]).exists():
        return JsonResponse({"error": "Username already exists"}, status=400)

    if Counselor.objects.filter(email=data["email"]).exists():
        return JsonResponse({"error": "Email already exists"}, status=400)

    counselor = Counselor(
         name=data["name"],
         username=data["username"],
         email=data["email"],
         phone=data["phone"]
    )
    counselor.set_password(data["password"])
    counselor.save()

    return JsonResponse({
        "message": "Counselor created",
         "id": counselor.id
         }, status=201)

def get_counselors(request):
    if request.method == "GET":
        counselors = Counselor.objects.all().values("id", "name", "email", "phone", "username")
        return JsonResponse(list(counselors), safe=False, status=200)
    return JsonResponse({"error": "Only GET allowed"}, status=405)

@csrf_exempt
def delete_counselor(request, counselor_id):
    if request.method == "DELETE":
        try:
            counselor = Counselor.objects.get(id=counselor_id)
            counselor.delete()
            return JsonResponse(
                {"message": "Counselor deleted successfully"},
                status=200
            )
        except Counselor.DoesNotExist:
            return JsonResponse({"error": "Counselor not found"}, status=404)

    return JsonResponse({"error": "Only DELETE allowed"}, status=405)

@csrf_exempt
def update_counselor(request, counselor_id):
    if request.method == "PUT":
        data = json.loads(request.body)
        try:
            counselor = Counselor.objects.get(id=counselor_id)

            counselor.name = data.get("name", counselor.name)
            counselor.phone = data.get("phone", counselor.phone)

            new_email = data.get("email")
            if new_email != counselor.email:
                if Counselor.objects.filter(email=new_email).exists():
                    return JsonResponse({"error": "Email already exists"}, status=400)
                counselor.email = new_email

            counselor.save()
            return JsonResponse({"message": "Updated Successfully"}, status=200)

        except Counselor.DoesNotExist:
            return JsonResponse({"error": "Counselor not found"}, status=404)
    return JsonResponse({"error": "Only PUT allowed"}, status=405)


@csrf_exempt
def add_batch(request):
    if request.method == "POST":
        data = json.loads(request.body)

        name = data.get("name")
        code = data.get("code")
        course_id = data.get("course_id")
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if not all([name, code, course_id, start_date]):
            return JsonResponse(
                {"error": "All required fields must be filled"},
                status=400
            )

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return JsonResponse({"error": "Invalid course"}, status=400)

        if Batch.objects.filter(code=code).exists():
            return JsonResponse({"error": "Batch code already exists"}, status=400)

        Batch.objects.create(
            name=name,
            code=code,
            course=course,
            start_date=start_date,
            end_date=end_date
        )

        return JsonResponse({"message": "Batch created successfully"}, status=201)
    return JsonResponse({"error": "Only POST allowed"}, status=405)

@csrf_exempt
def get_batches(request):
    if request.method == "GET":
        batches = Batch.objects.select_related("course").values("id", "name", "code", "status", "start_date", "end_date", "course_id", course_name=F("course__name"),)
        return JsonResponse(list(batches), safe=False)
    return JsonResponse({"error": "Only GET allowed"}, status=405)

@csrf_exempt
def update_batch(request, batch_id):
    if request.method == "PUT":
        data = json.loads(request.body)

        try:
            batch = Batch.objects.get(id=batch_id)
        except Batch.DoesNotExist:
            return JsonResponse({"error": "Batch not found"}, status=404)

        batch.name = data.get("name", batch.name)
        batch.code = data.get("code", batch.code)
        batch.start_date = data.get("start_date", batch.start_date)
        batch.end_date = data.get("end_date", batch.end_date)
        batch.status = data.get("status", batch.status)

        if "course_id" in data:
            try:
                batch.course = Course.objects.get(id=data["course_id"])
            except Course.DoesNotExist:
                return JsonResponse({"error": "Invalid course"}, status=400)

        batch.save()
        return JsonResponse({"message": "Updated successfully"}, status=200)
    return JsonResponse({"error": "Only PUT allowed"}, status=405)

@csrf_exempt
def delete_batch(request, batch_id):
    if request.method == "DELETE":
        try:
            batch = Batch.objects.get(id=batch_id)
            batch.is_active = False
            batch.delete()
            return JsonResponse({"message": "Batch deactivated"}, status=200)
        except Batch.DoesNotExist:
            return JsonResponse({"error": "Batch not found"}, status=404)
    return JsonResponse({"error": "Only DELETE allowed"}, status=405)

@csrf_exempt
def add_course(request):
    if request.method == "POST":
        data = json.loads(request.body)
        name = data.get("name")
        code = data.get("code")

        if Course.objects.filter(code=code).exists():
            return JsonResponse({"error": "Course code already exists"}, status=400)
        
        Course.objects.create(name=name, code=code)
        return JsonResponse({"message": "Course added"}, status=201)
    return JsonResponse({"error": "Only POST allowed"}, status=405)

def get_courses(request):
    if request.method == "GET":
        courses = Course.objects.all().values("id", "name", "code")
        return JsonResponse(list(courses), safe=False)
    return JsonResponse({"error": "Only GET allowed"}, status=405)

@csrf_exempt
def update_course(request, course_id):
    if request.method == "PUT":
        data = json.loads(request.body)

        try:
            course = Course.objects.get(id=course_id)
            course.name = data.get("name", course.name)
            course.code = data.get("code", course.code)
            course.save()
            return JsonResponse({"message": "Updated successfully"}, status=201)
        except Course.DoesNotExist:
            return JsonResponse({"error": "Course not found"}, status=404)
    return JsonResponse({"error": "Only PUT allowed"}, status=405)

@csrf_exempt
def delete_course(request, course_id):
    if request.method == "DELETE":
        try:
            course = Course.objects.get(id=course_id)
            course.delete()
            return JsonResponse({"message": "Successfully deleted course"}, status=201)
        except Course.DoesNotExist:
            return JsonResponse({"error": "Course not found"}, status=404)
    return JsonResponse({"error": "Only DELETE allowed"}, status=405)

@csrf_exempt
def add_student(request):
    if request.method == "POST":
        data = json.loads(request.body)

        try:
            counselor = Counselor.objects.get(id=data["counselor_id"], is_active=True)
            
            batch = Batch.objects.get(id=data["batch_id"])

            if Student.objects.filter(email=data["email"]).exists():
                return JsonResponse({"error": "Email already exists"}, status=400)

            student = Student.objects.create(
                name=data["name"],
                email=data["email"],
                phone=data["phone"],
                counselor=counselor,
                batch=batch
            )
            return JsonResponse({"message": "New Student Added"}, status=201)
        except Counselor.DoesNotExist:
            return JsonResponse({"error": "Invalid Counselor"}, status=400)
        except Batch.DoesNotExist:
            return JsonResponse({"error": "Invalid Batch"}, status=400)
    return JsonResponse({"error": "Only POST allowed"}, status=405)

def get_students(request):
    counselor_id = request.GET.get("counselor_id")
    if not counselor_id:
        return JsonResponse([], safe=False)
    students = Student.objects.filter(counselor_id=counselor_id).select_related("batch", "batch__course").values(
        "id",
        "name",
        "email",
        "phone",
        "batch_id",
        course_name=F("batch__course__name"),
        batch_name=F("batch__name"),
    )
    return JsonResponse(list(students), safe=False)
    
@csrf_exempt
def update_student(request, student_id):
    if request.method == "PUT":
        data = json.loads(request.body)

        try:
            student = Student.objects.get(id=student_id)

            if "name" in data:
                student.name = data["name"]

            if "phone" in data:
                student.phone = data["phone"]

            if "email" in data and data["email"] != student.email:
                if Student.objects.filter(email=data["email"]).exists():
                    return JsonResponse({"error": "Email already exists"}, status=400)
                student.email = data["email"]

            if "batch_id" in data:
                student.batch = Batch.objects.get(id=data["batch_id"])

            if "course_id" in data:
                student.course = Course.objects.get(id=data["course_id"])

            student.save()
            return JsonResponse({"message": "Student updated successfully"}, status=200)

        except Student.DoesNotExist:
            return JsonResponse({"error": "Student not found"}, status=404)

    return JsonResponse({"error": "Only PUT allowed"}, status=405)

@csrf_exempt
def delete_student(request, student_id):
    if request.method == "DELETE":
        try:
            Student.objects.get(id=student_id).delete()
            return JsonResponse({"message": "Deleted Successfully"}, status=200)
        except Student.DoesNotExist:
            return JsonResponse({"error": "Student not found"}, status=404)
    return JsonResponse({"error": "Only DELETE allowed"}, status=405)

@csrf_exempt
def add_report(request):
    if request.method == "POST":
        data = json.loads(request.body)

        Report.objects.create(
            type=data["type"],
            student_name=data["student_name"],
            course=data["course"],
            performance_level=data.get("performance_level"),
            issue_type=data.get("issue_type"),
            risk_level=data.get("risk_level"),
            remarks=data["remarks"],
            counselor_id=data["counselor_id"]
        )
        return JsonResponse({"message": "Report added"}, status=201)
    return JsonResponse({"error": "Only POST allowed"}, status=405)

def get_reports(request):
    counselor_id = request.GET.get("counselor_id")

    qs = Report.objects.select_related("counselor")

    if counselor_id:
        qs = qs.filter(counselor_id=counselor_id)

    reports=qs.values(
        "id",
        "type",
        "student_name",
        "course",
        "performance_level",
        "issue_type",
        "risk_level",
        "remarks",
        "admin_response",
        "created_at",
        counselor_name=F("counselor__name"),
    )
    return JsonResponse(list(reports), safe=False)

@csrf_exempt
def admin_reply_report(request, report_id):
    if request.method == "PUT":
        data = json.loads(request.body)

        try:
            report = Report.objects.get(id=report_id)
            report.admin_response = data.get("admin_response", "")
            report.save()
            return JsonResponse({"message": "Reply sent"}, status=200)
        except Report.DoesNotExist:
            return JsonResponse({"error": "Report not found"}, status=404)

    return JsonResponse({"error": "Only PUT allowed"}, status=405)

# def get_all_reports(request):
#     if request.method == "GET":
#         reports = Report.objects.select_related("counselor").values(
#             "id",
#             "type",
#             "student_name",
#             "course",
#             "performance_level",
#             "issue_type",
#             "risk_level",
#             "remarks",
#             "admin_response",
#             "status",
#             "created_at",
#             counselor_name=F("counselor__name"),
#         )
#         return JsonResponse(list(reports), safe=False)
#     return JsonResponse({"error": "Only GET allowed"}, status=405)

# @csrf_exempt
# def acknowledge_report(request, report_id):
#     if request.method == "PUT":
#         try:
#             report = Report.objects.get(id=report_id)
#             report.status = "ACKNOWLEDGED"
#             report.save()
#             return JsonResponse({"message": "Acknowledged"})
#         except Report.DoesNotExist:
#             return JsonResponse({"error": "Not found"}, status=404)

#     return JsonResponse({"error": "Only PUT allowed"}, status=405)
