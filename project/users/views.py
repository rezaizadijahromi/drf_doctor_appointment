## Python modules
import datetime
from functools import partialmethod
import uuid
import random
import os.path
from django.core.checks import messages
from django.http import response

## email validator packege
from email_validator import validate_email, EmailNotValidError
from django.contrib.auth.tokens import default_token_generator
from django.core.files.storage import default_storage
from django.core.mail import EmailMessage
## django imports
from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.db.models import Q , Count
from django.core.files.storage import default_storage
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
## django restframework
from rest_framework import permissions, serializers, views, status
from rest_framework.views import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import FileUploadParser

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
    permission_classes  = [permissions.IsAuthenticated]
    def get(self, request):
        serializer = UserSerializer(request.user, many=False)
        return Response(serializer.data)

class UserProfileUpdateViewV2(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileSerializer

    def patch(self, request):
        profile = request.user.userprofile
        serializer = self.serializer_class(
            profile, data=request.data, partial=True
        )

        if serializer.is_valid():
            user = serializer.save().user
            new_email = request.data.get('email')
            email_valid_check_result = email_validator(new_email)
            user = request.user
            if new_email is not None and email_valid_check_result:
                user.email = new_email
                profile.email_verified = False
                user.save()
                profile.save()

            return Response({
                'success':True, 
                'message': 'successfully updated your profile',
                'user': UserSerializer(user).data,
                'updated_email': new_email
            }, status=status.HTTP_200_OK)

class UserPofileView(views.APIView):
    permission_classes  = [permissions.IsAuthenticated]

    def patch(self, request):
        new_email = request.data.get('email')
        email_valid_check_result = email_validator(new_email)

        if new_email is not None and email_valid_check_result:
            request.user.email = new_email
            request.user.email_verified = False

            request.user.save()
            serializer = UserSerializer(request.user, many=False)

        return Response({
            "success": True,
            "message": "successfully updated your profile",
            "updated_email": new_email,
            "user": serializer.data
        }, status=status.HTTP_200_OK)

class UserProfileDelete(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        request.user.delete()

        return Response({
            'success': True,
            'message': 'account deleted successfully'
        }, status=status.HTTP_200_OK)

class SendActivationEmail(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user_profile = UserProfile.objects.get(user=request.user)

        try:
            email_subject = 'Verify your account'
            message = render_to_string('verify-email.html', {
                'user': user_profile,
                'uid': urlsafe_base64_encode(force_bytes(request.user.pk)),
                'token': default_token_generator.make_token(request.user)
            })
            to_email = request.user.email
            email = EmailMessage(
                email_subject, message, to=[to_email]
            )

            email.send()
            return Response({
                'success': 'True',
                'message': 'Email send successfully'
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'success': False,
                'message': f'{e}'
            }, status=status.HTTP_403_FORBIDDEN)



class ProfilePictureUpdateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classe = (FileUploadParser,)

    def patch(self, request):
        random_number = random.Random()
        profile_pic = request.FILES["profile_pic"]
        extension = os.path.splitext(profile_pic.name)[1]
        profile_pic.name = f"{uuid.UUID(int=random_number.getrandbits(128))}{extension}"
        filename = default_storage.save(profile_pic.name, profile_pic)
        setattr(request.user.userprofile, "profile_pic", filename)

        if filename:
            request.user.userprofile.save()
            serializer = UserProfileSerializer(request.user.userprofile, many=False)

        return Response({
            "success": True,
            "message": "Profile picture has been successfully updated",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    

class UpdateSkillsView(views.APIView):
    permission_classes  = [permissions.IsAuthenticated]

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
    permission_classes  = [permissions.IsAuthenticated]

    def patch(self, request):
        user_profile = request.user.userprofile
        intrests = request.data
        user_profile.intrests.set(
            TopicTag.objects.get_or_create(name=interest['name'])[0] for interest in intrests
        )

        user_profile.save()
        serializer = UserProfileSerializer(user_profile, many=False)

        return Response(serializer.data)