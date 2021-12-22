## Python modules
import datetime
import uuid
import random
import os.path

## email validator packege
from email_validator import validate_email, EmailNotValidError

## django imports
from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User

## django restframework
from rest_framework import permissions, views, status
from rest_framework.views import Response

def email_validator(email):
    try:
        validate_email_data = validate_email(email)
        email_add = validate_email_data['email']
        return email_add
    except EmailNotValidError as e:
        return str(e)

class RegisterView(views.APIView):
    permissuib_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        email_valid_check_result = email_validator(email)
        messages = {'errors': []}

        ## validate fields and then save to db
        if username == "None":
            messages['errors'].append("username can't be empty")
        if email == "None":
            messages['errors'].append("email can't be empty")
        if not email_valid_check_result == email:
            messages['errors'].append(email_valid_check_result)
        if password == "None":
            messages['errors'].append("password can't be empty")
        if User.objects.filter(email=email).exists():
            messages['errors'].append("account already exists with this email id")
        if User.objects.filter(username_iexact=username).exists():
            messages['errors'].append(("Acount already exists with this username"))
        if len(messages['errors']) > 0:
            return Response({"detail":messages['errors']},status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create(
                username=username,
                email=email,
                password=make_password(password)
            )
            serializer = UserSerializerWithToken(user, many=False)
        except Exception as e:
            return Response({'detail':f'{e}'},status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data)