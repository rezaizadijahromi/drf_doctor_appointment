from django.db.models import fields
from rest_framework import serializers

from users.serializers import UserProfileSerializer

from .models import Room, Booking

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = (
            "id", "doctor", "room_name", "doctor_name", "description", "image", "get_vote_ratio"
        )

    def get_skills(self):
        return self.get_skills()

class RoomDetailBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = (
            "id", "booking_date", "start_timing","end_timing",
            "patient", "is_pending", "admin_did_accept",
            "patient_name",
        )
