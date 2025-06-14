from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from ninja import NinjaAPI, Schema
from backend.services.sports_data_api_handler import get_league_season, get_league_teams_meta
import backend.firebase_init 
from typing import List
from pydantic import Field
from ninja import NinjaAPI
from backend.services.firestore_user_handler import save_or_update_user
import os
import re
import requests
import json
from django.conf import settings
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
    email: str = ""
    displayName: str = ""
    provider: str = ""
@api.post("/save_user_data")
def save_user_data(request, data: UserData):
    if request.method == "OPTIONS":
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return JsonResponse(response) 
    try:
        save_or_update_user(data.dict())
        return JsonResponse({"status": "success"}, status=200)
    except Exception as e:
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
