import datetime


def slot_generator(min, start_h, end_h):
    time_slots = []
    start = datetime.datetime(2000, 1, 1, start_h, 0, 0)
    end = datetime.datetime(2000, 1, 1, end_h, 0, 0)
    buffer = datetime.timedelta(minutes=min)
    min_5_buffer = datetime.timedelta(minutes=5)
    
    while end.time().hour <= end_h:
        if len(time_slots) == 0:
            end = (start + buffer)
            time_slots.append(
                (start.time(), end.time())
            )
        else:
            start = end + min_5_buffer
            end = end + buffer + min_5_buffer

            time_slots.append(
                (start.time(), end.time())
            )
            min += 10

    return time_slots
