from django.urls import path
from .views import (
    EnvoyerMessageView,
    MessagesRecusView,
    MessagesEnvoyesView,
    MarquerCommeLuView,
)

urlpatterns = [
    path("envoyer/", EnvoyerMessageView.as_view(), name="message-envoyer"),
    path("recus/", MessagesRecusView.as_view(), name="messages-recus"),
    path("envoyes/", MessagesEnvoyesView.as_view(), name="messages-envoyes"),
    path("<int:pk>/lu/", MarquerCommeLuView.as_view(), name="message-lu"),
]
