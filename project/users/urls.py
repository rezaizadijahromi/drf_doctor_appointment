from django import urls
from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


from . import views

app_name = "users"

urlpatterns = [
    path('', views.users, name='users'),
    path('profile/', views.Profile.as_view(), name='profile'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.MyTokenObtainPairView.as_view(), name='login'),

    ## Update ##
    path("profile_update/", views.UserPofileView.as_view(), name="update_profile"),
    path("profile_update/photo/", views.ProfilePictureUpdateView.as_view(), name="update_profile_picture"),
    path('delete-profile/', views.UserProfileDelete.as_view(), name="delete-user"),
    path("profile_update/skills/", views.UpdateSkillsView.as_view(), name="update_skills"),
    path("profile_update/intrests/", views.UpdateInterestsView.as_view()),

    ## toekn ##
    path('refresh_token/', TokenRefreshView.as_view(), name='refresh_token'),

    ## Email verification ## 
    path('email/send-email-activation/', views.SendActivationEmail.as_view(), name='send-activation-email'),
    path('verify/<uidb64>/<token>/', views.Activate.as_view(), name='verify')
]

