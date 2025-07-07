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
                <i classname="event-time">{eventInfo.timeText} | {eventInfo.event.extendedProps.league}</i>
                <i className={icon_class} />
            </span>
            <hr />
            <b className="event-title">{eventInfo.event.title}</b>
            
        </span>
    )
}
export default CalendarEvent