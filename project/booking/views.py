import datetime
import uuid

from django.contrib.auth import get_user_model
from django.db.models import Avg, Count, Max, Min, Sum
from rest_framework import generics, status, permissions, views
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from .models import Booking, Room
from .serializer import BookingSerializer, RoomSerializer

class AllRoomView(views.APIView):
    def get(self, request):
        rooms = Room.objects.all()
        return Response(rooms)

class AllBookingView(views.APIView):
    def get(self, request):
        bookings = Booking.objects.all()
        return Response(bookings)



