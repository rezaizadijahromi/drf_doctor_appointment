import datetime
import uuid
from django.contrib.auth.tokens import default_token_generator

from django.core.files.storage import default_storage
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.core.mail import EmailMessage



from django.core.checks.messages import Error
from django.db.models import Avg, Count, Max, Min, Sum
from rest_framework import generics, serializers, status, permissions, views
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from users.models import UserProfile

from .slot_generator import slot_generator

from .models import Booking, Room
from .serializer import BookingSerializer, RoomSerializer, RoomDetailBookSerializer

class RoomView(views.APIView):
    def get(self, request):
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)

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

class RoomDetailTime(views.APIView):
    def post(self, request):
        try:
            res, date = [], request.data["date"]
            roomID = request.data["id"]

            for item in Booking.objects.filter(
                    booking_date__exact=date,
                    room__exact=roomID
                 ).order_by(
                        'start_timing',
                        '-admin_did_accept',
                        '-is_pending')\
                            .distinct(
                            'start_timing'):

                x = {"start_timing": item.start_timing,
                     "end_timing": item.end_timing,
                     "admin_did_accept": item.admin_did_accept,
                     "is_pending": item.is_pending,
                    "availabel" : False
                     }
                res.append(x)
            # Create and append empty slots
            check = list()
            for i in res:
                check.append((i["start_timing"],i["end_timing"]))

            todayDate, todayTime = str(datetime.date.today()), datetime.datetime.today().time()

            buffer = datetime.timedelta(minutes=10)
            start = datetime.datetime(2000, 1, 1, 8, 0, 0)
            end = datetime.datetime(2000, 1, 1, 19, 00, 0)
            delta = datetime.timedelta(hours=1, minutes=30)

            while start <= end:
                if start.time() not in check[0]:
                    if todayDate == date and (start+buffer).time() <= todayTime:
                        start += delta
                        continue

                    if start.time().hour == 8:
                        y = {"start_timing": start.time(),
                            "end_timing": (start+delta).time(),
                            "admin_did_accept": False,
                            "is_pending": False,
                            "availabel": True
                            }
                    else:
                        y = {"start_timing": (start + buffer ).time(),
                            "end_timing": (start+delta).time(),
                            "admin_did_accept": False,
                            "is_pending": False,
                            "availabel": True
                            }

                    for time in check:
                        if time[1].hour == y["start_timing"].hour and time[1].minute > y["start_timing"].minute:
                            y["availabel"] = False
                        elif time[1].hour == y["end_timing"].hour and time[1].minute == y["end_timing"].minute:
                            y["start_timing"]
                            # y["availabel"] = False
                            y["end_timing"] = time[0] 
                        if time[0].hour == y["start_timing"].hour :
                            y["availabel"] = False

                    if y["availabel"] == True:
                        res.append(y)
                start += delta

                
            return Response(sorted(res, key=lambda i: i['start_timing']))

        except Exception as IndexError:
            return Response({"message": "no booking time is availabel"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"message": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)

class RoomDetail(views.APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, roomId):
        try:
            now = datetime.datetime.now().date()
            data = request.data
            try:
                date = data["date"]
            except:
                date = now
            room = Room.objects.get(id__exact=roomId)

            times = Booking.objects.filter(
                room=room,
                booking_date__exact=date
            ).order_by(
                'start_timing', '-admin_did_accept',
                '-is_pending'
            ).exclude(admin_did_accept=True, is_pending=True)

            serializer_data = RoomDetailBookSerializer(times, many=True).data 

            room_serializer = RoomSerializer(room).data
        
            print(room.doctor.get_profile_pic())

            if len(serializer_data) > 0:
                return Response({
                    "status": "success",
                    "data": serializer_data,
                    "date": date,
                    "doctor_information": room_serializer,
                    "skills": room.doctor.get_skills(),
                    "intrests": room.doctor.get_intrests(),
                    "doctor_pic": room.doctor.get_profile_pic()
                })  
            else:
                return Response({
                    "status": "success",
                    "data": [],
                    "date": date,
                    "doctor_information": room_serializer,
                    "skills": room.doctor.get_skills(),
                    "intrests": room.doctor.get_intrests(),
                    "doctor_pic": room.doctor.get_profile_pic()
                })
        except Exception as e:
            return Response({
                "status": "failed",
                'message': e
            })

    def post(self, request, roomId):
        user_profile = UserProfile.objects.get(
            user=request.user
        )
        try:
            data  = request.data

            slot_id = data["slot_id"]
            date = data["date"]

            room = Room.objects.get(
                id__exact=roomId
            )

            slot = Booking.objects.filter(
                room=room,
                booking_date__exact=date,
                id=slot_id
            )

            if slot[0].is_pending:

                slot.update(
                    patient=request.user.userprofile,
                    is_pending=True
                )
                
                email_subject = "Metting has been booked"
                message = render_to_string(
                    'email_booked.html',
                    {
                        "sender": 'punisher1234@gmail.com',
                        "reciever": user_profile,
                        'uid': urlsafe_base64_encode(force_bytes(request.user.pk)),
                        'token': default_token_generator.make_token(request.user)
                    }
                )

                to_email = request.user.email
                email = EmailMessage(
                    email_subject, message,
                    to=[to_email]
                )

                email.send()

                return Response({
                    "status": "success",
                    "message": "You booked a slot wait for admin confirmation"
                })
            else:
                return Response({
                    "status": "success",
                    "message": "slot has been in queue"
                })
            
        except Exception as e:
            return Response({
                "status": "fail",
                'message': e
            })

    def delete(request, roomId):
        user_profile = request.user.userprofile

        try:
            data  = request.data

            slot_id = data["slot_id"]
            date = data["date"]

            room = Room.objects.get(
                id__exact=roomId
            )

            slot = Booking.objects.filter(
                room=room,
                booking_date__exact=date,
                id=slot_id
            )

            slot.update(
                patient=None,
                is_pending=False
            )

              
            email_subject = "Metting has been cancelled"
            message = render_to_string(
                'email_cancell.html',
                {
                    "sender": 'punisher1234@gmail.com',
                    "reciever": user_profile,
                    'uid': urlsafe_base64_encode(force_bytes(request.user.pk)),
                    'token': default_token_generator.make_token(request.user)
                }
            )

            to_email = request.user.email
            email = EmailMessage(
                email_subject, message,
                to=[to_email]
            )

            email.send()

            return Response({
                "status": "success",
                "message": "meeting has been cancelled"
            })

        except Exception as e:
            return Response({
                "status": "fail",
                'message': e
            })

class AdminView(views.APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            data  = request.data

            date = data["date"]
            roomId = data["roomId"]

            room = Room.objects.get(
                id__exact=roomId
            )


            slots = Booking.objects.filter(
                room=room,
                booking_date__exact=date,
                is_pending=True
            )

            slot_serializers = RoomDetailBookSerializer(slots, many=True).data

            return Response({
                "status":"success",
                "data": slot_serializers
            })

        except Exception as e:
            return Response({
                "status": "failed",
                'message': e
            })

    def put(self, request):
        user_profile = request.user.userprofile
        actions_list = [
            "DELETE", "ACCEPT"
        ]

        try:
            data  = request.data

            date = data["date"]
            roomId = data["roomId"]
            slot_id = data["slot_id"]
            action = data["action"]

            try:
                feed_back = data["admin_feedback"]
            except:
                feed_back = ""

            room = Room.objects.get(
                id__exact=roomId
            )

            slots = Booking.objects.filter(
                room=room,
                booking_date__exact=date,
                is_pending=True,
                id=slot_id
            )


            if action in actions_list:

                if action == "DELETE":
                    if slots[0].admin_did_accept:
                    
                        slots.update(
                            patient=None,
                            is_pending=False,
                            admin_did_accept=False
                        )

                                    
                        email_subject = "Your request has been rejected"
                        message = render_to_string(
                            'email_cancell.html',
                            {
                                "sender": 'punisher1234@gmail.com',
                                "reciever": user_profile,
                                'uid': urlsafe_base64_encode(force_bytes(request.user.pk)),
                                'token': default_token_generator.make_token(request.user),
                                "action": "delete"
                            }
                        )

                        to_email = request.user.email
                        email = EmailMessage(
                            email_subject, message,
                            to=[to_email]
                        )

                        email.send()

                        return Response({
                            "status":"success",
                            "message": "request has been rejected"
                        }, status=status.HTTP_200_OK)
                    else:
                        return Response({
                            "status":"success",
                            "message": "request not been assign"
                        }, status=status.HTTP_200_OK)

                elif action == "ACCEPT":

                    if not slots[0].admin_did_accept:
                        slots.update(
                            admin_did_accept=True,
                            admin_feedback=feed_back
                        )

                                                  
                        email_subject = "Your request for meeting has been accepted"
                        message = render_to_string(
                            'email_cancell.html',
                            {
                                "sender": 'punisher1234@gmail.com',
                                "reciever": user_profile,
                                'uid': urlsafe_base64_encode(force_bytes(request.user.pk)),
                                'token': default_token_generator.make_token(request.user),
                                "action": "accept"
                            }
                        )
                        to_email = request.user.email
                        email = EmailMessage(
                            email_subject, message,
                            to=[to_email]
                        )

                        email.send()

                        return Response({
                            "status":"success",
                            "message": "request has been accepted"
                        }, status=status.HTTP_200_OK)
                    else:
                        return Response({
                            "status": "success",
                            "message": "already accepted"
                        })
            else:
              raise TypeError("action type not finde")  

        except Exception as e:
            return Response({
                "status": "failed",
                'message': e
            })

    def post(self, request):
        try:
            res = []
            data = request.data
            minute, startH, endH = data['minute'], data["startH"], data["endH"]

            #time_slots --> [((start, min, s), (end, min, s))]

            time_slots = slot_generator(minute, startH, endH)
            date = data["date"]
            length = data["length"]
            room = data["roomId"]

            roomId = Room.objects.get(id__exact=room)
            
            for slot in time_slots[0:length]:
                b = Booking.objects.create(
                    room=roomId,
                    booking_date=date,
                    start_timing=slot[0],
                    end_timing=slot[1],
                    is_pending=False,
                    admin_did_accept=False
                )

                res.append({
                    "start":b.start_timing,
                    "end": b.end_timing,
                    "is_pending": False,
                    "admin_did_accept": b.admin_did_accept
                })

            
            return Response({
                "success":True,
                "message":"Slots has been created",
                "data": {
                    "room-id": room,
                    "rooms":[i for i in res]
                }
            })
            
        except Exception as e:
            return Response({
                'success':False,
                'message': e
            })


class UserPastBookingsView(views.APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        slot = Booking.objects.filter(booking_date__lte=datetime.date.today())
        res = []
        for item in slot.filter(booking_date__lt=datetime.date.today()).union(slot.filter(booking_date__exact=datetime.date.today(), end_timing__lt=datetime.datetime.now().time())):
            x = {"booking_date": item.booking_date,
                 "start_timing": item.start_timing,
                 "end_timing": item.end_timing,
                 "admin_did_accept": item.admin_did_accept,
                 "is_pending": item.is_pending,
                 "purpose_of_booking": item.purpose_of_booking,
                 "admin_feedback": item.admin_feedback,
                 "room_name": item.room.room_name
                 }
            res.append(x)
        return Response(sorted(res, key=lambda i: i['start_timing']))



class AllBookingView(views.APIView):
    def get(self, request):
        bookings = Booking.objects.all()
        return Response(bookings)

class AdminAddRoom(views.APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        try:
            data = request.data
            room_name = data['name']
            try:
                description = data['description']
            except:
                description = 'No description'
            doctor_name = data["doctor_name"]

            doc = UserProfile.objects.get(
                username=doctor_name
            )
            if doc:
                room = Room.objects.create(
                    room_name=room_name,
                    description=description,
                    doctor=doc
                )

                serializer_data = RoomSerializer(room).data

                return Response({
                    'status':'success',
                    'data': serializer_data
                })
            else:
                return Response({
                    "status": 'failed',
                    "message": 'doctor not fund'
                })
            
        except Exception as e:
            return Response({
                'status':'failed',
                'message': e
            })


# class BookRoomSlotView(views.APIView):
#     startTimes = [datetime.time(8, 0), datetime.time(9, 30), datetime.time(11, 0), datetime.time(13, 0), datetime.time(14, 30), datetime.time(16, 0), datetime.time(17, 30), datetime.time(19, 0)]
#     endTimes = [datetime.time(9, 30), datetime.time(11, 0), datetime.time(12, 30), datetime.time(14, 30), datetime.time(16, 0), datetime.time(17, 30), datetime.time(19, 0), datetime.time(20, 30)]

#     # time_slots = slot_generator()

    
#     def post(self, request):
#         try:
#             res, data = [], request.data
#             try:
#                 purpose = data["purpose_of_booking"]
#             except:
#                 purpose = "Purpose not provided"

#             start = datetime.datetime.strptime(data["startTime"],"%H:%M:%S")
#             end = datetime.datetime.strptime(data["endTime"], "%H:%M:%S")

#             roomId, date = data["id"], data["date"]

#             if Booking.objects.filter(
#                     booking_date__exact=date,
#                     start_timing=start,
#                     end_timing=end
#                   ).exclude(admin_did_accept=False, is_pending=False).count() >= 1:
                
#                 return Response({
#                     "success": False,
#                     "message":"You have already booked this timing. You cannot book 2 slots at the same time"
#                     }, status.HTTP_409_CONFLICT)
            
#             for item in Booking.objects.filter(
#                     booking_date__exact=date,
#                     room__exact=roomId
#                 ):
#                 if (end <= item.start_timing or start >= item.end_timing):
#                     # no clashes if the entire for loop doesn't break then the following else is executed
#                     continue
#                 elif (item.admin_did_accept == True):
#                     # Already booked
#                     return Response({
#                         "success": False,
#                         "message":"This slot has already been booked"
#                      }, status=status.HTTP_306_RESERVED)
#                 else:
#                     # empty slot with many bookings
#                     room = Room.objects.get(id__exact=roomId)
#                     b = Booking.objects.create(
#                         room=room,
#                         booking_date=date,
#                         start_timing=start,
#                         end_timing=end,
#                         purpose_of_booking=purpose,
#                         is_pending=True
#                     )
                        
#                     return Response(
#                         {
#                             "success":True,
#                             "message":"Booking has been added to the existing queue"}
#                         ,status=status.HTTP_202_ACCEPTED)
#             else:
#                 # no clashes executed if for loop doesnt break show this response 
#                 return Response(
#                     {
#                         "success":False,
#                         "message":"invalid data"
#                     }, status=status.HTTP_202_ACCEPTED)

#         except Exception as e:
#             return Response({"message": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
