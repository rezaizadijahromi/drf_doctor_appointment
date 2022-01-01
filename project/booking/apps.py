from django.apps import AppConfig
from time import sleep


class BookingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'booking'

    def ready(self):
        from .updater import startfunc
        # sleep(5000)
        startfunc()
