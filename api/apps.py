from django.apps import AppConfig
from backend.firebase_init import get_firestore_client
from backend.services.firestore_user_handler import seed_games
from backend.services.firestore_user_handler import deduplicate_games
class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
    
    def ready(self):
        #import backend.fireabase_init
        get_firestore_client()
        #seed_games()
        #deduplicate_games()
