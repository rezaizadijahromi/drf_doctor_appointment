from django.db import models
from django.contrib.auth.models import User
import uuid


class TopicTag(models.Model):
    name = models.CharField(primary_key=True, max_length=150, null=False, blank=False)

    def __str__(self):
        return self.name

class SkillTag(models.Model):
    name = models.CharField(primary_key=True, max_length=150, null=False, blank=False)

    def __str__(self):
        return self.name

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, null=True)
    username = models.CharField(max_length=200, null=True)
    profile_pic = models.ImageField(blank = True, null=True, default = "default.png")
    vote_ratio = models.IntegerField(blank=True, null=True, default=0) 
    skills = models.ManyToManyField(SkillTag, related_name="personal_skills", blank=True)
    intrests = models.ManyToManyField(TopicTag, related_name="personal_skills", blank=True)
    email_verified = models.BooleanField(default=False)
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)


    def get_skills(self):
        return self.skills.all().values_list('name', flat=True).distinct()

    def get_intrests(self):
        return self.intrests.all().values_list('name', flat=True).distinct()

    def get_profile_pic(self):
        try:
            pic = self.profile_pic.url
        except:
            pic = None
        return pic

    def __str__(self):
        return str(self.user.username) 
