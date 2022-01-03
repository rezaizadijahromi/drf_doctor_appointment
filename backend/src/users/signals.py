from django.db.models.signals import post_save, pre_save, post_delete
from django.contrib.auth.models import User
from .models import UserProfile

def create_profile(sender, instance, created, *args, **kwargs):
    if created:
        UserProfile.objects.create(
            user=instance,
            name=instance.username,
            username=instance.username
        )

def update_profile(sender, instance, created, *args, **kwargs):
    user_profile, _ = UserProfile.objects.get_or_create(user=instance)
    if not created:
        user_profile.username = instance.username
        user_profile.save()

post_save.connect(create_profile, sender=User)
post_save.connect(update_profile, sender=User)
