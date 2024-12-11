from rest_framework import viewsets
from .models import FocusSession
from .serializers import FocusSessionSerializer

class FocusSessionViewSet(viewsets.ModelViewSet):
    queryset = FocusSession.objects.all().order_by('-start_time')
    serializer_class = FocusSessionSerializer
