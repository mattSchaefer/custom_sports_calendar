from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
# Create your views here.
from ninja import NinjaAPI, Schema
# from backend.services.file_reader import get_sentences_with_one_of2, get_lines, get_random_lines
# from backend.services.gpt_handler import gpt_translate
from typing import List
from pydantic import Field
# Create your views here.
from ninja import NinjaAPI
import os
import re
import requests
import json
from django.conf import settings
api = NinjaAPI()

@api.get("/hello")
def hello(request):
    if request.method == "OPTIONS":
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return JsonResponse(response)

    return JsonResponse({"message": "Hello, world!"})

@api.post("/get_eventsseason")
def get_eventsseason(request):
   
    #url = f"https://api.football-data.org/v4/competitions/PL/seasons/{season}/matches"
    url = "https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4424&s=2025"
    headers = {
       'Content-Type': 'application/json',
       'Access-Control-Allow-Origin': '*',
       #'Authorization': f'Bearer {os.getenv("GPT_API_KEY")}',
    }
    

    try:
        response = JsonResponse({"message": "test"})
        #response["Access-Control-Allow-Origin"] = "*"
        return response
    # if request.method == "OPTIONS":
    #     response = HttpResponse()
    #     response["Access-Control-Allow-Origin"] = "*"
    #     response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    #     response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    #     return response
    except Exception as e:
        return JsonResponse({"error": e}, status=500)