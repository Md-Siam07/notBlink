#from django.urls import path, include
from . import views

from django.urls import path, re_path
from django.conf.urls.static import static
from django.conf import settings

urlpatterns=[
    re_path(r'^recognize/$', views.recognize),
]