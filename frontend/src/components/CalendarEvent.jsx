import React from 'react'
import { useState, useEffect } from 'react';
import {useAuth} from '../contexts/auth_context.jsx';
const CalendarEvent = ({eventInfo}) => {
    const league_name_sport_map = {
        MLB: "baseball-ball",
        MLS: "futbol",
        EPL: "futbol",
        NCAAF: "football-ball",
        NFL: "football-ball",
        NASCAR: "racing",
        F1: "racing"
    }
    const icon_class = `fa fa-${league_name_sport_map[eventInfo.event.extendedProps.league]}`
    const { user, loginWithGoogle, loginWithFacebook, loading, signOut, accessToken, favorites, setFavorites, sync_favorites, games, setGames } = useAuth();
    const get_team_image = (team_id) => {
        console.log("getting team image for team id: ", team_id)
        let url = ""
        console.log("favorites: ", favorites)
        for(let i = 0; i < Object.entries(favorites).length; i++){
            console.log("checking category: ", i)
            //var cat = favorites[i]
            var cat = Object.entries(favorites)[i][1]
            console.log(cat)
            for(let j = 0; j < cat.length; j++){
                if(cat[j].id == team_id){
                    let team = cat[j]
                    if(team.strBadge && team.strBadge.length > 0){
                        url = team.strBadge
                        break
                    }else if(team.strLogo && team.strLogo.length > 0){
                        url = team.strLogo
                        break
                    }else if(team.listLogo && team.listLogo.length > 0){
                        for(let k = 0; k < team.listLogo.length; k++){
                            if(team.listLogo[k] && team.listLogo[k].length > 0){
                                url = team.listLogo[k]
                                break
                            }
                        }
                    }
                }
            }
        }
        return url
    }
    return(
        <span className="calendar-event">
            <span className="calendar-event-head">
                <span className="left">
                    {eventInfo.event.extendedProps.is_favorite && <i className="fa fa-star favorite-event-icon" />}
                    <i classname="event-time">
                        <span className={eventInfo.event.extendedProps.is_favorite ? "favorite-team-highlight event-time" : ""}>{eventInfo.timeText} </span>
                        | {eventInfo.event.extendedProps.league}
                    
                    </i>
                </span>
                <i className={icon_class} />
            </span>
            
            {/* <b className="event-title">{eventInfo.event.title}</b> */}
            <span className="event-title">
                <span className={
                    eventInfo.event.extendedProps.home_team.is_favorite ? "favorite-team-highlight event-team-span" :
                    eventInfo.event.extendedProps.home_team.is_followed ? "followed-team-highlight event-team-span" : 
                    "event-team-span"
                    }>
                    
                    {eventInfo.event.extendedProps.home_team.name}
                    { eventInfo.event.extendedProps.home_team.is_favorite || eventInfo.event.extendedProps.home_team.is_followed ?
                        <img className="team-logo" src={get_team_image(eventInfo.event.extendedProps.home_team.id)}  />
                        : <></>
                    }
                </span>
                    {" vs. "} 
                <span className={
                    eventInfo.event.extendedProps.away_team.is_favorite ? "favorite-team-highlight event-team-span" :
                    eventInfo.event.extendedProps.away_team.is_followed ? "followed-team-highlight event-team-span" : 
                    "event-team-span"
                    }
                >
                    
                    {eventInfo.event.extendedProps.away_team.name}
                    { eventInfo.event.extendedProps.away_team.is_favorite || eventInfo.event.extendedProps.away_team.is_followed ?
                        <img className="team-logo" src={get_team_image(eventInfo.event.extendedProps.away_team.id)}  />
                        : <></>
                    }
                </span>
            </span>
            
            
        </span>
    )
}
export default CalendarEvent