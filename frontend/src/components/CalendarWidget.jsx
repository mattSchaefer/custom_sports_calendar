import React from 'react'
import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import '../App.css'
import { useAuth } from '../contexts/auth_context.jsx'
import useLeaguesAndTeamsHook from '../hooks/LeaguesAndTeamsHook.jsx';
import FavoriteSelector from './FavoriteSelector.jsx';

import AccountDetails from './AccountDetails.jsx'
import AccountFavorites from './AccountFavorites.jsx'
const CalendarWidget = () => {
  const { user, loginWithGoogle, loginWithFacebook, loading, logOut, accessToken, favorites, setFavorites, sync_favorites, games, setGames  } = useAuth()
  const [selectorExpanded, setSelectorExpanded] = useState(false)
  const [leaugues, teams] = useLeaguesAndTeamsHook(user, accessToken);
  const headerToolbar = {
    left: 'prev,next',
    center: 'title',
    right: 'today,dayGridDay,dayGridWeek,dayGridMonth'
  }
  const events = []
  console.log(games.length)
  for(var i =0; i < games.length; i++){
    var title = games[i].home_team_name.toString() + " vs. " + games[i].away_team_name.toString() 
    var start = new Date(games[i].start) || null
    if(start)
      events.push({
        title: title,
        start: start
      }) 
  }
    
  return(
    <div>
      <AccountFavorites />
      <div>
        <div>  
          <span className="schedule-and-edit">
            <h1 className="watchlist-header">
              Schedule
            </h1>
            <div>
              <span className="fav-select-header-and-toggle">
                <button onClick={(e) => setSelectorExpanded(() => !selectorExpanded)}>
                  <i className="fa fa-pencil" />
                </button>
              </span>
            </div>  
          </span>
        </div>
        <div className="avaliable-leagues-container">
          {
            selectorExpanded &&
            <div className="avaliable-leagues-inner">
                {
                    leaugues.map((league, index) => (  
                      <FavoriteSelector league={league} teams={teams.filter((team) => team.league_id == league.id)} key={index} user={user} accessToken={accessToken} setFavorites={setFavorites} favorites={favorites} />
                    ))
                }
            </div>
          }
        </div>
        <div className="full-calendar-container">
          <FullCalendar
              plugins={[dayGridPlugin]}
              initialView='dayGridWeek'
              weekends={true}
              events={events}
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