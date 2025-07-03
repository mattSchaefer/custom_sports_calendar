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
            db.collection("games").add({
                "date": dt_utc,
                "league_name": league_name,
                "league_id": leagueId,
                "season": year,
                "home_team_id": game["idHomeTeam"],
                "away_team_id": game["idAwayTeam"],
                "home_team_name": game["strHomeTeam"],
                "away_team_name": game["strAwayTeam"],
                "idEvent": game["idEvent"]
            })
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
        })
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
                "conference": conference
            })
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
            force_id_home = "CFB_" + str(game["homeId"])
            force_id_away = "CFB_" + str(game["awayId"])
            date_str = game["startDate"]
            dt = datetime.fromisoformat(date_str)
            dt_utc = dt.replace(tzinfo=pytz.utc)
            db.collection("games").add({
                "date": dt_utc,
                "league_name": "NCAAF",
                "league_id": "NCAAF",
                "season": "2025",
                "home_team_id": force_id_home,
                "away_team_id": force_id_away,
                "home_team_name": game["homeTeam"],
                "away_team_name": game["awayTeam"],
                "idEvent": game["id"]
            })
            print("added " + game["awayTeam"] + " at" + game["homeTeam"])
        return json
    except Exception as e:
        return e