def serialize_firestore_data(data):
    for key, value in data.items():
        if isinstance(value, firestore.DocumentReference):
            data[key] = value.path  # or value.id
    return data
from google.cloud import firestore

def clean_for_json(obj):
    if isinstance(obj, dict):
        return {k: clean_for_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_for_json(i) for i in obj]
    elif isinstance(obj, firestore.DocumentReference):
        return obj.path  # or obj.id, depending on what you need
    else:
        return obj