from django.db import models
from django.contrib.auth.models import User

import uuid
import datetime

from users.models import UserProfile


class Room(models.Model):
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    room_name = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f'{self.room_name} with id {self.id} is full'

class Booking(models.Model):
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    doctor = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=False)
    patient = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=False)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="booking")
    booking_date = models.DateField(default=datetime.date.today)
    start_timing = models.TimeField()
    end_timing = models.TimeField()
    purpose_of_booking = models.TextField()
    is_pending = models.BooleanField(default=False)
    admin_did_accept = models.BooleanField(default=False)
    admin_feedback = models.TextField(blank=True, null=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"From: {self.start_timing} - To:{self.end_timing}"