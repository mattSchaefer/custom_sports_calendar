from django.apps import AppConfig
from backend.firebase_init import get_firestore_client

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
    
    def ready(self):
        #import backend.fireabase_init
        get_firestore_client()
