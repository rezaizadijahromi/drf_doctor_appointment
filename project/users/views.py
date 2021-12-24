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
from django.db.models import Q , Count

## django restframework
from rest_framework import permissions, serializers, views, status
from rest_framework.views import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import PageNumberPagination

## drf jwt
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

## app imports
from .models import SkillTag, TopicTag, UserProfile
from .serializers import (UserProfileSerializer, UserSerializer,
                          UserSerializerWithToken, CurrentUserSerializer)


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
        if User.objects.filter(username__iexact=username).exists():
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

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['name'] = user.userprofile.name
        token['profile_pic'] = 'static' + user.userprofile.profile_pic.url
        token['is_staff'] = user.is_staff
        token['id'] = user.id

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def users(request):
    query = request.query_params.get('q') or ''
    users = User.objects.filter(
        Q(userprofile__name__icontains=query) | 
        Q(userprofile__username__icontains=query)
    )
    paginator = PageNumberPagination()
    paginator.page_size = 10
    result_page = paginator.paginate_queryset(users,request)
    serializer = UserSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


class Profile(views.APIView):
    peromission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        serializer = UserSerializer(request.user, many=False)
        return Response(serializer.data)

class UpdateSkillsView(views.APIView):
    peromission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        user_profile = request.user.userprofile
        skills = request.data
        user_profile.skills.set(
            SkillTag.objects.get_or_create(name=skill['name'])[0] for skill in skills
        )
        user_profile.save()
        serializer = UserProfileSerializer(user_profile, many=False)

        return Response(serializer.data)

class UpdateInterestsView(views.APIView):
    peromission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        user_profile = request.user.userprofile
        intrests = request.data
        user_profile.intrests.set(
            TopicTag.objects.get_or_create(name=interest['name'])[0] for interest in intrests
        )

        user_profile.save()
        serializer = UserProfileSerializer(user_profile, many=False)

        return Response(serializer.data)