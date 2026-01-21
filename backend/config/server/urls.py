from django.urls import path
# from . import views
from .views import (admin, counselor_login, add_counselor, get_counselors, delete_counselor, update_counselor, add_batch,
                       get_batches, update_batch, delete_batch, add_course, get_courses, update_course, 
                       delete_course, add_student, get_students, update_student, delete_student, add_report, 
                       get_reports, admin_reply_report,)

urlpatterns = [
    # path('hello/', views.hello),
    path('adminCheck/', admin),
    path('counselor-login/', counselor_login),
    path('add-counselor/', add_counselor),
    path('get-counselors/', get_counselors),
    path('delete-counselor/<int:counselor_id>/', delete_counselor),
    path('update-counselor/<int:counselor_id>/', update_counselor),
    path('add-batch/', add_batch),
    path('get-batches/', get_batches),
    path('update-batch/<int:batch_id>/',update_batch),
    path('delete-batch/<int:batch_id>/', delete_batch),
    path('add-course/', add_course),
    path('get-courses/', get_courses),
    path('update-course/<int:course_id>/', update_course),
    path('delete-course/<int:course_id>/', delete_course),
    path('add-student/', add_student),
    path('get-students/', get_students),
    path('update-student/<int:student_id>/', update_student),
    path('delete-student/<int:student_id>/', delete_student),
    path('add-report/', add_report),
    path('get-reports/', get_reports),
    path('admin-reply/<int:report_id>/', admin_reply_report),
]