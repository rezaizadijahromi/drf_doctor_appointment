from django.db.models import fields
from rest_framework import serializers
from .models import Room, Booking

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"

class RoomSerializer(serializers.ModelSerializer):
    # booking = Booking(many=True, read_only=True)

    class Meta:
        model = Room
        fields = "__all__"

class RoomDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = (
            "id", "booking_date", "start_timing",
            "end_timing", "doctor", "patient"
        )