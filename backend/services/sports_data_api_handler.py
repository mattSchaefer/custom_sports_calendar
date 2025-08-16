from django.http import HttpResponse, JsonResponse
import os
import re
import requests
import json
from django.conf import settings
from dotenv import load_dotenv
from backend.services.firestore_user_handler import seed_games
from backend.firebase_init import get_firestore_client
from datetime import datetime
import pytz
import logging
logger = logging.getLogger(__name__)
load_dotenv()
def api_key():
    return os.getenv("SPORTS_DATA_API_KEY")
def build_request_headers():
    return {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-API-KEY': os.getenv("SPORTS_DATA_API_KEY"),
    }
def build_request_url(resource):
    return (f"{sports_data_base_url()}/{resource}")
def sports_data_base_url():
    return "https://www.thesportsdb.com/api/v2/json"
 
def get_league_games(leagueId, year):
    db = get_firestore_client()
    resource = f"schedule/league/{leagueId}/{year}"
    url = build_request_url(resource)
    headers = build_request_headers()
    response = requests.post(url, headers=headers,) #data=payload
    print(response)
    if response.status_code == 200:
        #return response#JsonResponse(response.json(), status=200)#{"message", "success"}

        league_ref = db.collection("leagues").document(leagueId)
        league_doc = league_ref.get()
        league_data = league_doc.to_dict()
        league_name = league_data.get("name")
        
        games = response.json()["schedule"]
        for game in games:
            date_str = game["strTimestamp"]
            dt = datetime.fromisoformat(date_str)
            dt_utc = dt.replace(tzinfo=pytz.utc)
            # db.collection("games").add({
            #     "date": dt_utc,
            #     "league_name": league_name,
            #     "league_id": leagueId,
            #     "season": year,
            #     "home_team_id": game["idHomeTeam"],
            #     "away_team_id": game["idAwayTeam"],
            #     "home_team_name": game["strHomeTeam"],
            #     "away_team_name": game["strAwayTeam"],
            #     "idEvent": game["idEvent"]
            # })
            db.collection("games").document(game["idEvent"]).set({
                "date": dt_utc,
                "league_name": league_name,
                "league_id": leagueId,
                "season": year,
                "strEvent": game.get("strEvent") or "",#game["strEvent"],
                "home_team_id": game.get("idHomeTeam") if game.get("idHomeTeam") is not None else None, #game["idHomeTeam"],
                "away_team_id": game.get("idAwayTeam") if game.get("idAwayTeam") is not None else None,#game["idAwayTeam"],
                "home_team_name": game.get("strHomeTeam") or "",#game["strHomeTeam"],
                "away_team_name": game.get("strAwayTeam") or "",#game["strAwayTeam"],
                "idEvent": game["idEvent"]
            }, merge=True)
            #print("added " + game["idAwayTeam"] + " at" + game["idHomeTeam"])
            print("added " + game["idEvent"])
    else:
        return JsonResponse({"error": "Failed to fetch data"}, status=response.status_code)
def get_league_teams_meta(leagueId):
    db = get_firestore_client()
    resource = f"list/teams/{leagueId}"
    url = build_request_url(resource)
    headers = build_request_headers()
    response = requests.post(url, headers=headers,) #data=payload
    print(response)
    teams = response.json()["list"]
    for team in teams:
        
        db.collection("teams").document(team["idTeam"]).set({
            "id": team["idTeam"],
            "name": team["strTeam"],
            "short_name": team["strTeamShort"],
            "league": team["idLeague"],
            "league_id": team["idLeague"],
            "league_name": team["strLeague"],
            "colors": [team["strColour1"], team["strColour2"], team["strColour3"]],
            "strBadge": team["strBadge"],
            "strLogo": team["strLogo"]
        }, merge=True)
        print("added team: " + team["strTeam"])
    return len(response.json()["list"])
    if response.status_code == 200:
        
        return response#JsonResponse(response.json(), status=200)#{"message", "success"}
    else:
        return JsonResponse({"error": "Failed to fetch data"}, status=response.status_code)

def delete_ncaaf_docs():    
    db = get_firestore_client()
    collection_ref = db.collection("games")
    docs = collection_ref.stream()

    for doc in docs:
        data = doc.to_dict()
        league_id = data.get("league_id")
        
        if league_id == "NCAAF":
            print(f"Deleting {doc.id} with league_id: {league_id}")
            doc.reference.delete()
def purge_games():
    db = get_firestore_client()
    collection_ref = db.collection("games")

    batch_size = 500
    docs = collection_ref.stream()

    batch = db.batch()
    count = 0

    for doc in docs:
        batch.delete(doc.reference)
        count += 1

        if count == batch_size:
            batch.commit()
            batch = db.batch()
            count = 0

    # Commit remaining deletes if any
    if count > 0:
        batch.commit()
def get_ncaa_teams():
    load_dotenv()

    try:
        db = get_firestore_client()
        url = "https://api.collegefootballdata.com/teams"
        bearer = "Bearer " + os.getenv('CFB_API_BEARER')

        headers = {
            "Authorization": bearer,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
        response = requests.get(url, headers=headers)
        print(response)
        json = response.json()
        for team in json:
            force_id = "CFB_" + str(team["id"])
            mascot = team.get("mascot") or ""
            abbreviation = team.get("abbreviation") or ""
            color = team.get("color") or ""
            alternateColor = team.get("alternateColor") or ""
            logos = team.get("logos") or ""
            conference = team.get("conference") or ""
            name = team["school"] + " " + mascot
            db.collection("teams").document(force_id).set({
                "id": force_id,
                "name": name,
                "short_name": abbreviation,
                "league": "NCAAF",
                "league_id": "NCAAF",
                "league_name": "NCAAF",
                "colors": [color, alternateColor],
                "strBadge": "",
                "strLogo": "",
                "listLogo": logos,
                "conference": conference,
                "school": team["school"],
            }, merge=True)
            print("added team: " + name)
        return json
    except Exception as e:
        return e
def get_ncaa_games():
    load_dotenv()

    try:
        db = get_firestore_client()
        url = "https://api.collegefootballdata.com/games?year=2025"
        bearer = "Bearer " + os.getenv('CFB_API_BEARER')

        headers = {
            "Authorization": bearer,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
        response = requests.get(url, headers=headers)
        json = response.json()
        for game in json:
            new_doc_id = f"CFB_GAME_{game['id']}"
            force_id_home = "CFB_" + str(game["homeId"])
            force_id_away = "CFB_" + str(game["awayId"])
            date_str = game["startDate"]
            dt = datetime.fromisoformat(date_str)
            dt_utc = dt.replace(tzinfo=pytz.utc)
            # db.collection("games").add({
            #     "date": dt_utc,
            #     "league_name": "NCAAF",
            #     "league_id": "NCAAF",
            #     "season": "2025",
            #     "home_team_id": force_id_home,
            #     "away_team_id": force_id_away,
            #     "home_team_name": game["homeTeam"],
            #     "away_team_name": game["awayTeam"],
            #     "idEvent": game["id"]
            # })
            db.collection("games").document(new_doc_id).set({
                "date": dt_utc,
                "league_name": "NCAAF",
                "league_id": "NCAAF",
                "season": "2025",
                "home_team_id": force_id_home,
                "away_team_id": force_id_away,
                "home_team_name": game["homeTeam"],
                "away_team_name": game["awayTeam"],
                "idEvent": game["id"]
            }, merge=True)
            print("added " + game["awayTeam"] + " at" + game["homeTeam"])
        return json
    except Exception as e:
        return e
def refresh_cfb_rankings(season, week): #2024, 16
    load_dotenv()
    print(".......")
    try:
        clear_cfb_rankings()
        print("Cleared CFB rankings")
        db = get_firestore_client()
        url = f"https://api.collegefootballdata.com/rankings?year={season}&week={week}"
        bearer = "Bearer " + os.getenv('CFB_API_BEARER')

        headers = {
            "Authorization": bearer,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
        print(headers)
        print(url)
        response = requests.get(url, headers=headers)
        json = response.json()
        
        print(json[0])
        polls = json[0]["polls"]
        ranks = []
        ncaa_10_ids = []
        ncaa_25_ids = []
        for poll in polls:
            if poll.get("poll") == "AP Top 25":
                ranks = poll.get("ranks", [])
                break
        for rank in ranks:
           rank_number = rank.get("rank")
           school = rank.get("school")
           conference = rank.get("conference")
           team = db.collection("teams").where("school", "==", school).where("conference", "==", conference).get()
           if team:
               team = team[0].to_dict()
               team_id = team.get("id")
               team_name = team.get("name")
               if rank_number <= 10:
                    ncaa_10_ids.append(team_id)
               if rank_number <= 25:
                    ncaa_25_ids.append(team_id)
               if team_id:
                   db.collection("teams").document(team_id).set({
                       "rank": rank_number,
                       "name": team_name,
                   }, merge=True)
                   print(f"Updated {school} with rank {rank_number}")
           else:
               print(f"Team not found for school: {school}, conference: {conference}")
        print("about to purge games from NCAAF_10 and NCAAF_25...")
        purge_ranked_games()
        print("Purged ranked games")
        seed_ranked_games_league(ncaa_10_ids, "NCAAF_10")
        seed_ranked_games_league(ncaa_25_ids, "NCAAF_25")
        return json
    except Exception as e:
        return e
def clear_cfb_rankings():
    
    db = get_firestore_client()
    teams_ref = db.collection("teams")
    
    # Query for teams where "rank" field exists and is not null
    teams_with_rank = teams_ref.where("rank", ">", 0).stream()

    count = 0
    for doc in teams_with_rank:
        doc_ref = doc.reference
        doc_ref.update({
            "rank": ""
        })
        print(f" Cleared rank for team: {doc.id}")
        count += 1

    print(f"\n Cleared rank from {count} teams.")
def seed_ranked_games_league(team_ids, league_id):
    print("seeding ranked games for league: " + league_id)
    db = get_firestore_client()
    games_ref = db.collection("games")
    home_query = games_ref.where("league_id", "==", "NCAAF").where("home_team_id", "in", team_ids)
    away_query = games_ref.where("league_id", "==", "NCAAF").where("away_team_id", "in", team_ids)
    home_results = list(home_query.stream())
    away_results = list(away_query.stream())
    combined_results = home_results + away_results
    for game in combined_results:
        #copy everything from this game to a new game with the league_id set to the ranked league
        game_data = game.to_dict()
        new_game_id = f"{league_id}_{game.id}"
        game_data["league_id"] = league_id
        game_data["league_name"] = league_id
        game_data["idEvent"] = new_game_id
        game_data["id"] = new_game_id
        #game_data["date"] = game_data["date"].isoformat()
        db.collection("games").document(new_game_id).set(game_data, merge=True)
        print(f"Seeded ranked game: {new_game_id} for league: {league_id}")
    
def purge_ranked_games():
    db = get_firestore_client()
    collection_ref = db.collection("games")
    docs = collection_ref.stream()
    ops_in_batch = 0
    batch_size = 500
    batch = db.batch()
    count = 0
    for doc in docs:
        data = doc.to_dict()
        if data.get("league_id") == "NCAAF_10" or data.get("league_id") == "NCAAF_25":
            batch.delete(doc.reference)
            count += 1
            ops_in_batch += 1

        if ops_in_batch == batch_size:
            batch.commit()
            print(f"Committed batch of {ops_in_batch} deletions.")
            batch = db.batch()
            ops_in_batch = 0
    if ops_in_batch > 0:
        batch.commit()
        print(f"Committed final batch of {ops_in_batch} deletions.")       
    print(f"Purged {count} ranked games.")