import datetime
from time import sleep

# from datetime import datetime, timedelta, date


from apscheduler.schedulers.background import BackgroundScheduler

from django.template.loader import render_to_string
from django.core.mail import EmailMessage


from .models import Booking, Room
from users.models import UserProfile

scheduler = BackgroundScheduler()


def send_reminder():
    print("send reminder")
    try:
        now = datetime.datetime.now()


        for room in Room.objects.all():
            booking = Booking.objects.filter(is_pending=False, booking_date=now, room=room)


            now = datetime.datetime.now()
            now_5_10 = now + datetime.timedelta(minutes = 10)

            # print(now.today().time())
            # print(now_5_10.time())

            for b in booking:
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

def accpet_request():
    try:
        now = datetime.datetime.now()
        now_5_10 = now + datetime.timedelta(minutes = 10)


        for room in Room.objects.all():
            print(room)
            booking = Booking.objects.filter(
                is_pending=True,admin_did_accept=False, booking_date=datetime.date.today(),room=room
            )

            if not booking.exists():
                print("No data to take action upon")
            else:
                slots = booking.filter(start_timing__gte=now, start_timing__lte=now_5_10)

                if not slots.exists():
                    print("This slot doesn't have any pending request") 
                else:
                    y = min(slots.values_list('created_at', flat=True))
                    accept = slots.get(created_at=y)
                    accept.admin_did_accept = True
                    accept.is_pending = False
                    accept.admin_feedback = "Accepted by automation"
                    accept.save()
                    reject = slots.exclude(id=accept.id)
                    feedback = "Declined on first come first serve basis"
                    reject.update(
                        admin_did_accept=False,
                        is_pending=False, admin_feedback=feedback
                    )

    except Exception as e:
        print(f"Error Accept: {e}")


def startfunc():
    scheduler.add_job(send_reminder, "interval",minutes=10)
    scheduler.add_job(accpet_request, "interval",minutes=10)
    scheduler.start()
