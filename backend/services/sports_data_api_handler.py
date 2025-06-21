from django.http import HttpResponse, JsonResponse
import os
import re
import requests
import json
from django.conf import settings
from dotenv import load_dotenv
from backend.services.firestore_user_handler import seed_games
load_dotenv()
def api_key():
    return os.getenv("SPORTS_DATA_API_KEY")
def build_request_headers():
    return {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        #'Authorization': f'Bearer {os.getenv("SPORTS_DATA_API_KEY")}',
    }
def build_request_url(resource):
    return (f"{sports_data_base_url()}/{api_key()}/{resource}")
def sports_data_base_url():
    return "https://www.thesportsdb.com/api/v1/json"
 
def get_league_season(leagueId, year):
    resource = f"eventsseason.php?id={leagueId}&s={year}"
    url = build_request_url(resource)
    headers = build_request_headers()
    response = requests.post(url, headers=headers,) #data=payload
    if response.status_code == 200:
        return response#JsonResponse(response.json(), status=200)#{"message", "success"}
    else:
        return JsonResponse({"error": "Failed to fetch data"}, status=response.status_code)
def get_league_teams_meta(leagueId):
    #seed_games() 
    resource = f"lookup_all_teams.php?id={leagueId}"
    url = build_request_url(resource)
    headers = build_request_headers()
    response = requests.post(url, headers=headers,) #data=payload
    if response.status_code == 200:
        return response#JsonResponse(response.json(), status=200)#{"message", "success"}
    else:
        return JsonResponse({"error": "Failed to fetch data"}, status=response.status_code)