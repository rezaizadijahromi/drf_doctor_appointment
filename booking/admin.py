from django.contrib import admin
from .models import Booking, Room


class BookingAdmin(admin.ModelAdmin):
    list_display = [
        'booking_date', 'start_timing', 'end_timing', 'admin_did_accept', 'is_pending', "room",
    ]

    list_filter = [
        'booking_date', 'start_timing', 'end_timing', 'admin_did_accept', 'is_pending', "room",
    ] 


admin.site.register(Room)
admin.site.register(Booking, BookingAdmin)