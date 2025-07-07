from datetime import datetime
from dateutil import parser
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
            data["followed_teams"] = []
            data["followed_leagues"] = []
            user_ref.set(data)
        snapshot = user_ref.get()
        return JsonResponse(snapshot.to_dict())
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
def update_user_favorite_or_added_teams_or_leagues(oauth_user):
#@which can be "favorite_teams", "followed_teams", or "followed_leagues"
#@teams_or_leagues is a list of team or league IDs
    try:
        token = oauth_user["accessToken"]#request.headers.get("Authorization", "").split("Bearer ")[-1]
        if not token:
            return JsonResponse({"error": "Unauthorized"}, status=401)
        decoded_token = auth.verify_id_token(token)
        if decoded_token.get("uid") != oauth_user["uid"]:
            return JsonResponse({"error": "Unauthorized"}, status=401)
        db = get_firestore_client()
        user_ref = db.collection("users").document(oauth_user["uid"])
        snapshot = user_ref.get()
        if not snapshot.exists:
            return JsonResponse({"error": "User not found"}, status=404)
        user_data = snapshot.to_dict()
        user_data[oauth_user["which"]] = list(oauth_user["teams_or_leagues"])
        user_ref.update(user_data)
        return JsonResponse({"message": list(user_data[oauth_user["which"]])})
    except Exception as e:
        import traceback
        print("Exception occurred:", str(e))
        traceback.print_exc() 
        return JsonResponse({"error": str(e)}, status=500)
def get_user_schedule(oauth_user):
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
        user_dict = snapshot.to_dict()

        followed_leagues = user_dict.get("followed_leagues", [])
        followed_teams = user_dict.get("followed_teams", [])
        favorite_teams = user_dict.get("favorite_teams", [])
        followed_league_ids = {d["id"] for d in followed_leagues}
        teams_for_query = []
        all_games = []
        all_teams = followed_teams + favorite_teams
        for team in all_teams:
            if team["league_id"] not in followed_league_ids:
                teams_for_query.append(team["id"])
        away_games = []
        for team in teams_for_query:
            team_id = team #= team.to_dict()["id"]
            away_games = db.collection("games").where("away_team_id", "==", team_id).stream()
            home_games = db.collection("games").where("home_team_id", "==", team_id).stream()
            if away_games:
                for doc in away_games:
                    game = doc.to_dict()
                    game["start"]  = game["date"]#parse_game_date(game["date"])
                    all_games.append(game)
                if home_games :
                    for doc in home_games:
                        game = doc.to_dict()
                        game["start"]  = game["date"]#parse_game_date(game["date"])
                        all_games.append(game)
        league_games = None
        if len(followed_league_ids):
            league_games = db.collection("games").where("league_id", "in", followed_league_ids).stream()
        if league_games:
            for doc in league_games:
                game = doc.to_dict()
                game["start"]  = game["date"]#parse_game_date(game["date"])
                all_games.append(game)
        return all_games
    except Exception as e:
        import traceback
        print("Exception occurred:", str(e))
        traceback.print_exc() 
        return JsonResponse({"error": str(e)}, status=500)
#TODO: add get schedule 1 month at a time, and 1 week at a time... accept "month start" or "week start"
def parse_game_date(date_str):
    parts = date_str.split("TBD")
    if len(parts) > 1:
        #return datetime.strptime(parts[0].strip(), "%A, %B %d, %Y")
        #return parser.parse(parts[0].strip())
        return parser.parse(parts[0].strip().rsplit("(", 1)[0].strip())
    else:
        #return datetime.strptime(date_str, "%A, %B %d, %Y %I:%M %p (%Z)")
        cleaned = date_str.rsplit("(", 1)[0].strip()
        return parser.parse(cleaned)
def get_leagues():
    db = get_firestore_client()
    leagues_ref = db.collection("leagues")
    docs = leagues_ref.stream()
    leagues = []
    for doc in docs:
        league_data = doc.to_dict()
        league_data["id"] = doc.id
        leagues.append(league_data)
    return leagues#JsonResponse(leagues, safe=False)
def get_teams_from_league(league_id):
    db = get_firestore_client()
    teams_ref = db.collection("teams")
    query = teams_ref.where("league_id", "==", league_id)
    docs = query.stream()
    teams = []
    for doc in docs:
        team_data = doc.to_dict()
        team_data["id"] = doc.id
        teams.append(team_data)
    return JsonResponse(teams, safe=False)
def get_all_teams():
    db = get_firestore_client()
    teams_ref = db.collection("teams")
    docs = teams_ref.stream()
    teams = []
    for doc in docs:
        team_data = doc.to_dict()
        team_data["id"] = doc.id
        teams.append(team_data)
    return teams#JsonResponse(teams, safe=False)    
    
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