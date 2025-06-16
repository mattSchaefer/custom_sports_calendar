import base64
import json
import os
import firebase_admin
from firebase_admin import credentials, firestore

firebase_app = None
db = None
def get_firestore_client():
    global firebase_app, db
    if not firebase_app:
        encoded_creds = os.environ.get("FIREBASE_CREDENTIALS_BASE64")
        if not encoded_creds:
            raise Exception("Firebase credentials not found in environment variables")
        decoded_creds = base64.b64decode(encoded_creds)
        cred_dict = json.loads(decoded_creds)
        cred = credentials.Certificate(cred_dict)
        firebase_app = firebase_admin.initialize_app(cred)
        db = firestore.client()
    return db
# Decode the base64 credentials from the environment
# encoded_creds = os.environ.get("FIREBASE_CREDENTIALS_BASE64")
# if not encoded_creds:
#     raise Exception("Firebase credentials not found in environment variables")

# decoded_creds = base64.b64decode(encoded_creds)
# cred_dict = json.loads(decoded_creds)

# # Initialize Firebase app once per process
# if not firebase_admin._apps:
#     cred = credentials.Certificate(cred_dict)
#     firebase_admin.initialize_app(cred)