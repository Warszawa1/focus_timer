from django.db import models

class FocusSession(models.Model):
    title = models.CharField(max_length=100)
    duration = models.IntegerField()  # duration in minutes
    start_time = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} - {self.start_time}"