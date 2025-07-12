import React from 'react'
import { useState, useEffect } from 'react';
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
                </span>
                    {" vs. "} 
                <span className={
                    eventInfo.event.extendedProps.away_team.is_favorite ? "favorite-team-highlight event-team-span" :
                    eventInfo.event.extendedProps.away_team.is_followed ? "followed-team-highlight event-team-span" : 
                    "event-team-span"
                    }
                >
                    {eventInfo.event.extendedProps.away_team.name}
                </span>
            </span>
            
        </span>
    )
}
export default CalendarEvent