import datetime
import uuid

from django.contrib.auth import get_user_model
from django.db.models import Avg, Count, Max, Min, Sum
from rest_framework import generics, serializers, status, permissions, views
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from .models import Booking, Room
from .serializer import BookingSerializer, RoomSerializer

class RoomView(views.APIView):
    def get(self, request):
        rooms = Room.objects.all()
        return Response(rooms)

    def post(self, request):
        try:
            data = request.data
            room_name = data["room_name"]
            description = data["description"]

            if room_name is not None:
                room = Room.objects.create(
                    room_name=room_name, 
                    description=description,
                )       
                room.save()
                serializer = RoomSerializer(room, many=False)
                return Response({
                    'status': 'success',
                    'message': "room has been created",
                    'data': serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'status': 'failed',
                    'message': "None value for room_name is not acceptable",
                })

        except Exception as e:
            return Response({
                'status' : 'failed',
                'message': e
            })

class DetailRoomView(views.APIView):
    def post(self, request):
        try:
            res, date = [], request.data["date"]
            for item in Booking.objects.filter(booking_date__exact=date).order_by('start_timing', '-admin_did_accept', '-is_pending').distinct('start_timing'):
                x = {"start_timing": item.start_timing,
                     "end_timing": item.end_timing,
                     "admin_did_accept": item.admin_did_accept,
                     "is_pending": item.is_pending}
                res.append(x)
            # Create and append empty slots
            check = list(i['start_timing'] for i in res)
            todayDate, todayTime = str(datetime.date.today()), datetime.datetime.today().time()
            buffer = datetime.timedelta(minutes=10)
            start = datetime.datetime(2000, 1, 1, 8, 0, 0)
            end = datetime.datetime(2000, 1, 1, 19, 00, 0)
            delta = datetime.timedelta(hours=1, minutes=30)
            while start <= end:
                if start.time() not in check:
                    if start == datetime.datetime(2000, 1, 1, 12, 30, 0):
                        start += datetime.timedelta(minutes=30)
                    if todayDate == date and (start+buffer).time() <= todayTime:
                        start += delta
                        continue
                    y = {"start_timing": start.time(),
                         "end_timing": (start+delta).time(),
                         "admin_did_accept": False,
                         "is_pending": False}
                    res.append(y)
                start += delta
            return Response(sorted(res, key=lambda i: i['start_timing']))
        except:
            return Response({"message": "Invalid/Bad request"}, status=status.HTTP_400_BAD_REQUEST)


class AllBookingView(views.APIView):
    def get(self, request):
        bookings = Booking.objects.all()
        return Response(bookings)



