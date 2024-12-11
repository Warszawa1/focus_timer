from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FocusSessionViewSet

router = DefaultRouter()
router.register(r'sessions', FocusSessionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]