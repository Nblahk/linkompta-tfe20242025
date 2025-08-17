from django.urls import path
from .views import (
    MessageCreateView,
    MessageReceivedListView,
    MessageSentListView,
    MessageMarkAsReadView,
)

urlpatterns = [
    path("send/", MessageCreateView.as_view(), name="send-message"),
    path("received/", MessageReceivedListView.as_view(), name="received-messages"),
    path("sent/", MessageSentListView.as_view(), name="sent-messages"),
    path("<int:pk>/read/", MessageMarkAsReadView.as_view(), name="read-message"),
]
