import datetime
# from datetime import datetime, timedelta, date


from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events, register_job

from .models import Booking, Room

scheduler = BackgroundScheduler()
scheduler.add_jobstore(DjangoJobStore(), "default", seconds=50)


# @register_job(scheduler, "cron", minute=0, replace_existing=True)
def update_req():
    print("Successfully ran the jobs")

    try:
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

        buffer = datetime.timedelta(minutes=5)
        todayDate, todayTime = str(datetime.date.today()), datetime.datetime.today().time()

        c_date = "2021-12-26"


        for room in Room.objects.all():
            booking = Booking.objects.filter(is_pending=True, booking_date=c_date, room=room)


            now = datetime.datetime.now()
            now_5_10 = now + datetime.timedelta(minutes = 10)

            # print(now.today().time())
            # print(now_5_10.time())


            for b in booking:

                print(now_5_10.time())
                if (now_5_10.time()) >= b.start_timing and (now_5_10.time()) <= b.end_timing:
                    print("need to send email")
                    print(f"{b.start_timing} to {b.end_timing}")


        print("Successfully ran the jobs")
    except Exception as e:
        print("Some error occured: "+str(e))


# register_events(scheduler)




def start():
    scheduler.add_job(update_req, "interval", minutes=1)
    scheduler.start()
    print("Scheduler started!")