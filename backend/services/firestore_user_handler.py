from datetime import datetime
from backend.firebase_init import get_firestore_client

def save_or_update_user(oauth_user):
    db = get_firestore_client()
    user_ref = db.collection("users").document(oauth_user["uid"])
    snapshot = user_ref.get()
    data = {
        "uid": oauth_user["uid"],
        "email": oauth_user["email"],
        "displayName": oauth_user["displayName"],
        "provider": oauth_user["provider"],
        "last_login": datetime.now().isoformat(),
    }
    if snapshot.exists:
        user_ref.update(data)
    else:
        data["created_at"] = datetime.now().isoformat()
        data["roles"] = ["user"]
        user_ref.set(data)