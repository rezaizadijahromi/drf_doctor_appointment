from django.urls import path

from . import views

app_name = "booking"

urlpatterns = [
    path("room/", views.RoomView.as_view(), name="room"),
    path("room/<str:roomId>/", views.RoomDetail.as_view(), name="detail"),
    path("room/<str:roomId>/near/",
         views.ClosestSlotView.as_view(), name="nearest"),
    path("room/<str:roomId>/book/",
         views.BookAppointment.as_view(), name="detail-book"),

    path("room-detail/", views.RoomDetailTime.as_view(), name="room-detail"),

    path("room/<str:roomId>/patient/",
         views.get_patient_info, name="patient-info"),



    path("past/", views.UserPastBookingsView.as_view()),

    ## admin ##
    path("admin/<str:roomId>/", views.AdminView.as_view(), name="admin"),
    path("admin-room/", views.AdminAddRoom.as_view(), name="admin-room"),
    path("admin/<str:roomId>/managment/",
         views.GetAllBookedSlotView.as_view(), name="admin-managment"),
    path("admin/<str:roomId>/assign/",
         views.AdminAssignPatient.as_view(), name="admin-assign"),


]
# path("slotview/", views.BookRoomSlotView.as_view()),
