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
from rest_framework import permissions, views

def email_validator(email):
    try:
        validate_email_data = validate_email(email)
        email_add = validate_email_data['email']
        return email_add
    except EmailNotValidError as e:
        return str(e)

class RegisterView(views.APIView):
    pass