import re
from django.contrib.auth.models import User
from django.test import client
from rest_framework.test import APIClient
import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from ..models import SkillTag, TopicTag
from users.views import email_validator

class AccountTest(APITestCase):
    def setUp(self):
        url = reverse("users:register")
        data = {
            'username':'test',
            'email': 'test@gmail.com',
            'password': 'test@123'
        } 

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'test')
        self.test_user = User.objects.get(username='test')
        self.test_user_pwd = 'test@123'

    def test_users_login(self):
        url = reverse('users:login')
        data = {
            'username':'test',
            'password':'test@123'
        }
        client = APIClient()
        response = client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_profile_update_view(self):
        url = 'users:update_profile'
        reversed_url = reverse(url)
        data = {
            'email':'TEST@gmail.com'
        }
        client = APIClient()
        client.force_authenticate(user=self.test_user)
        response = client.patch(reversed_url,data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

