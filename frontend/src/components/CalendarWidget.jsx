import React from 'react'
import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import '../App.css'
import { useAuth } from '../contexts/auth_context.jsx'
import AccountDetails from './AccountDetails.jsx'
import AccountFavorites from './AccountFavorites.jsx'
const CalendarWidget = () => {
    const { user, loginWithGoogle, loginWithFacebook, loading, logOut, accessToken, favorites, setFavorites, sync_favorites, games, setGames  } = useAuth()
    const events = [
        { title: 'Meeting', start: new Date() }
    ]
    const headerToolbar = {
      left: 'prev,next',
      center: 'title',
      right: 'today,dayGridDay,dayGridWeek,dayGridMonth'
    }
    const events2 = []
    console.log(games.length)
    for(var i =0; i < games.length; i++){
      var title = games[i].home_team_name.toString() + " vs. " + games[i].away_team_name.toString() 
      var start = new Date(games[i].start) || null
      if(start)
        events2.push({
          title: title,
          start: start
        }) 
    }
    console.log(events2)
    
    return(
        <div>
            <div>
                <AccountFavorites />
                <h1 className="watchlist-header">Schedule</h1>
                <div className="full-calendar-container">
                  <FullCalendar
                      plugins={[dayGridPlugin]}
                      initialView='dayGridWeek'
                      weekends={true}
                      events={events2}
                      eventContent={renderEventContent}
                      headerToolbar={headerToolbar}
                  />
                </div>
            </div>
        </div>
    )
}
function renderEventContent(eventInfo) {
  return (
    <span>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </span>
  )
}
export default CalendarWidget