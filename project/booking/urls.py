from django.urls import path

from . import views

app_name = "booking"

urlpatterns = [
    path("room/", views.RoomView.as_view(), name="room"),
    path("room-detail/", views.RoomDetailTime.as_view(), name="room-detail"),
    path("slotview/", views.BookRoomSlotView.as_view()),
    path("past/", views.UserPastBookingsView.as_view()),

    ## admin ##
    path("admin-add-slot/", views.AdminCreateSlotView.as_view(), name="admin-add-slot")
]