from django.urls import path

from . import views

app_name = "booking"

urlpatterns = [
    path("room/", views.RoomView.as_view(), name="room"),
    path("room-detail/", views.RoomFreeTime.as_view(), name="room-detail")
]