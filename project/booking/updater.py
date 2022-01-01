import datetime
from time import sleep

# from datetime import datetime, timedelta, date


from apscheduler.schedulers.background import BackgroundScheduler

from django.template.loader import render_to_string
from django.core.mail import EmailMessage


from .models import Booking, Room
from users.models import UserProfile

scheduler = BackgroundScheduler()


def update_req():
    try:
        c_date = "2021-12-26"

        for room in Room.objects.all():
            booking = Booking.objects.filter(is_pending=False, booking_date=c_date, room=room)


            now = datetime.datetime.now()
            now_5_10 = now + datetime.timedelta(minutes = 10)

            # print(now.today().time())
            # print(now_5_10.time())

            for b in booking:

                print("here we are1")



                user = UserProfile.objects.get(
                    username=b.patient
                )

                print(user)

                if (now_5_10.time()) >= b.start_timing and (now_5_10.time()) <= b.end_timing:
                    email_subject = "Metting reminder"
                    message = render_to_string(
                        'email_cancell.html',
                        {
                            "sender": 'punisher1234@gmail.com',
                            "reciever": b.patient,
                        }
                    )

                    to_email = user.user.email
                    email = EmailMessage(
                        email_subject, message,
                        to=[to_email]
                    )

                    email.send()



    except Exception as e:
        print("Some error occured: "+str(e))


def startfunc():
    scheduler.add_job(update_req, "interval", start_date="2022-01-01 09:30:00", end_date="2022-01-01 12:30:00",minutes=10)
    scheduler.start()


# x = datetime.now()
# rounded = (x - (x - datetime.min) % timedelta(minutes=30)).strftime("%H:%M")
# for room in Room.objects.all():
#     booking = Booking.objects.filter(is_pending=True, booking_date=date.today(), Room=room)
#     # Handle empty slots
#     if not booking.exists():
#         print("no data to take action upon")
#     else:
#         slots = booking.filter(start_timing=rounded)
#         if not slots.exists():
#             print("This slot doesn't have any pending requests")
#         else:
#             y = min(slots.values_list('created_at', flat=True))
#             accept = slots.get(created_at=y)
#             accept.admin_did_accept = True
#             accept.is_pending = False
#             accept.admin_feedback = "Accepted on first come first server basis"
#             accept.save()
#             reject = slots.exclude(id=accept.id)
#             feedback = "Declined on first come first serve basis"
#             reject.update(admin_did_accept=False,
#                           is_pending=False, admin_feedback=feedback)