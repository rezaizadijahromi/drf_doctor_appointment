from django.urls import path

from . import views

app_name = "booking"

urlpatterns = [
    path("room/", views.RoomView.as_view(), name="room"),
    path("room-detail/", views.RoomDetailTime.as_view(), name="room-detail"),

    path("detail-room/<str:roomId>/", views.RoomDetail.as_view(), name="detail"),

    path("past/", views.UserPastBookingsView.as_view()),

    ## admin ##
    path("admin/", views.AdminView.as_view(), name="admin"),
    path("admin-room/", views.AdminAddRoom.as_view(), name="admin-room")

]
    # path("slotview/", views.BookRoomSlotView.as_view()),