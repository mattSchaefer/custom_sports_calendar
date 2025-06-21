from datetime import datetime
from django.http import HttpResponse, JsonResponse
from backend.firebase_init import get_firestore_client
from django.conf import settings
from firebase_admin import credentials, auth, firestore
def save_or_update_user(oauth_user):
    try:
        db = get_firestore_client()
        token = oauth_user["accessToken"]#request.headers.get("Authorization", "").split("Bearer ")[-1]
        if not token:
            return JsonResponse({"error": "Unauthorized"}, status=401)
        decoded_token = auth.verify_id_token(token)
        if decoded_token.get("uid") != oauth_user["uid"]:
            return JsonResponse({"error": "Unauthorized"}, status=401)
        uid = decoded_token.get("uid")
        user_ref = db.collection("users").document(oauth_user["uid"])
        snapshot = user_ref.get()
        data = {
            "uid": oauth_user["uid"],
            "provider_email": oauth_user["provider_email"], #oauth_user["email"],
            "provider_phone": oauth_user["provider_phone"],
            "provider_display_name": oauth_user["provider_display_name"], #oauth_user["displayName"],
            "provider": oauth_user["provider"], #oauth_user["provider"],
            "last_login": datetime.now().isoformat(),
        }
        if snapshot.exists:
            user_ref.update(data)
        else:
            data["created_at"] = datetime.now().isoformat()
            data["roles"] = ["user"]
            data["favorite_teams"]=[]
            data["added_teams"] = []
            data["favorite_leagues"] = []
            user_ref.set(data)
        #return JsonResponse()#user_ref.dict()
        snapshot = user_ref.get()
        return JsonResponse(snapshot.to_dict())
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def get_user_from_id(id):
    db = get_firestore_client()
    
def seed_games():
    print("Seeding games...")
    db = get_firestore_client()
    games_ref = db.collection("games")
    seen_team_ids = set()
    with open("backend/seedfiles/mlb_2025_games.json", "r") as file:
        import json
        games = json.load(file)
        print(games[0])
        i = 0
        for game in games:
            league = game["league_name"]
            if "home" not in game or "away" not in game:
                print("Skipping invalid game entry (missing home/away):", game)
                continue
            for side in ["home", "away"]:
                if game[side] is not None:
                    team = game[side]
                    full_id = f"{league}_{team['id']}"
                    if full_id not in seen_team_ids:
                        seen_team_ids.add(full_id)
                        db.collection("teams").document(full_id).set({
                            "id": team["id"],
                            "name": team["team_name"],
                            #"short_name": team["team_name_short"],
                            "league": league,
                            "league_id": league
                        })
        for game in games:
            if "home" not in game or "away" not in game:
                print("Skipping invalid game entry (missing home/away):", game)
                continue
            db.collection("games").add({
                "date": game["date"],
                "tv": game["tv"],
                "league_name": game["league_name"],
                "league_id": game["league_name"],
                "season": game["season"],
                "home_team_id": f"{game['league_name']}_{game['home']['id']}",
                "away_team_id": f"{game['league_name']}_{game['away']['id']}",
                "home_team_name": game["home"]["team_name"],
                "away_team_name": game["away"]["team_name"],
            })
            
def delete_all_games():
    print("Deleting all games...")
    db = get_firestore_client()
    games_ref = db.collection("games")
    docs = games_ref.stream()
    for doc in docs:
        doc.reference.delete()
    print("All games deleted.")
def deduplicate_games():
    print("Deduplicating games...")
    db = get_firestore_client()
    games_ref = db.collection("games")
    docs = games_ref.stream()
    seen_games = set()
    for doc in docs:
        game_data = doc.to_dict()
        if "date" not in game_data or "home_team_id" not in game_data or "away_team_id" not in game_data:
            print(f"Skipping invalid game entry: {game_data}")
            continue
        game_key = (game_data["date"], game_data["home_team_id"], game_data["away_team_id"])
        if game_key in seen_games:
            print(f"Deleting duplicate game: {game_data}")
            doc.reference.delete()
        else:
            seen_games.add(game_key)
    print("Deduplication complete.")