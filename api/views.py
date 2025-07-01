from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from ninja import NinjaAPI, Schema
from backend.services.sports_data_api_handler import get_league_season, get_league_teams_meta
from backend.services.utilities import serialize_firestore_data, clean_for_json
import backend.firebase_init 
from typing import List, Dict, Any
from pydantic import Field
from ninja import NinjaAPI
from backend.services.firestore_user_handler import save_or_update_user, update_user_favorite_or_added_teams_or_leagues, get_leagues, get_all_teams, get_user_schedule
from django.http import HttpResponse, JsonResponse
import os
import re
import requests
import json
from django.conf import settings
from firebase_admin import credentials, auth, firestore
api = NinjaAPI()


class EventSeason(Schema):
    leagueId: str = "4424"
    year: str = "2025"
@api.post("/get_eventsseason")
def get_eventsseason(request, data: EventSeason):
    if request.method == "OPTIONS":
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return JsonResponse(response) 
    try:
        content = get_league_season(data.leagueId, data.year)
        return JsonResponse(content.json(), status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
class LeagueTeams(Schema):
    leagueId: str = "4424"
@api.post("/get_league_teams")
def get_league_teams(request, data: LeagueTeams):
    if request.method == "OPTIONS":
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return JsonResponse(response) 
    try:
        content = get_league_teams_meta(data.leagueId)
        return JsonResponse(content.json(), status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
class UserData(Schema):
    uid: str = ""
    provider_email: str = ""
    provider_phone: str = ""
    provider: str = ""
    provider_display_name: str = ""
    email: str = ""
    displayName: str = ""
    provider: str = ""
    accessToken: str = ""
    teams_or_leagues: List[Dict[str, Any]] = Field(default_factory=list)#List[str] = Field(default_factory=list)
    which: str = ""  # "favorite_teams", "followed", or "followed"
@api.post("/save_user_data")
def save_user_data(request, data: UserData):
    if request.method == "OPTIONS":
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return JsonResponse(response) 
    try:
        updated = save_or_update_user(data.dict())
        return updated
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
@api.post("/update_user_team_or_leagues")
def update_team_or_league_list(request, data: UserData):
    if request.method == "OPTIONS":
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return JsonResponse(response) 
    try:
        updated = update_user_favorite_or_added_teams_or_leagues(data.dict())
        return updated
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
@api.post("/refresh_schedule")
def refresh_user_schedule(request, data: UserData):
    if request.method == "OPTIONS":
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return JsonResponse(response) 
    try:
        games = get_user_schedule(data.dict())
        return JsonResponse({"games": games}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
class RetUserData(Schema):
    uid: str = ""
@api.post("/get_user_data")
def get_user_data(request, data: RetUserData):
    if request.method == "OPTIONS":
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return JsonResponse(response) 
    try:
        db = backend.firebase_init.get_firestore_client()
        token = request.headers.get("Authorization", "").split("Bearer ")[-1]
        if not token:
            return JsonResponse({"error": "Unauthorized"}, status=401)
        decoded_token = auth.verify_id_token(token)
        if decoded_token.get("uid") != data.uid:
            return JsonResponse({"error": "Unauthorized"}, status=401)
        uid = decoded_token.get("uid")
        user_ref = db.collection("users").document(uid)
        snapshot = user_ref.get()
        if snapshot.exists:
            return JsonResponse(snapshot.to_dict(), status=200)
        else:
            return JsonResponse({"error": "User not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
class LeaguesOrTeamsRequest(Schema):
    uid: str = ""
    accessToken: str = ""
    which: str = ""  # "leagues" or "teams"  
@api.post("/get_leagues_or_teams")
def get_leagues_or_teams(request, data: LeaguesOrTeamsRequest):
    if request.method == "OPTIONS":
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return JsonResponse(response) 
    try:
        ret_data = []
        ret_obj = {}
        if data.which == "leagues":
            ret_data = get_leagues()
            ret_data = clean_for_json(ret_data)
            ret_obj = {"leagues": ret_data}
        elif data.which == "teams":
            ret_data = get_all_teams()
            ret_data = clean_for_json(ret_data)
            ret_obj = {"teams": ret_data}
        else:
            return JsonResponse({"error": "Invalid request"}, status=400)
        return JsonResponse(ret_obj, status=200)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=500)
@api.get("/hello")
def hello(request):
    if request.method == "OPTIONS":
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return JsonResponse(response)

    return JsonResponse({"message": "Hello, world!"})
