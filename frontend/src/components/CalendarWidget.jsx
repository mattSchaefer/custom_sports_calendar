import React from 'react'
import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import '../App.css'
import { useAuth } from '../contexts/auth_context.jsx'
import useLeaguesAndTeamsHook from '../hooks/LeaguesAndTeamsHook.jsx';
import FavoriteSelector from './FavoriteSelector.jsx';
import { build_get_leagues_or_teams_request } from '../factories/get_leagues_or_teams_request_factory.js';

import AccountDetails from './AccountDetails.jsx'
import AccountFavorites from './AccountFavorites.jsx'
const CalendarWidget = () => {
  const { user, loginWithGoogle, loginWithFacebook, loading, logOut, accessToken, favorites, setFavorites, sync_favorites, games, setGames  } = useAuth()
  const [selectorExpanded, setSelectorExpanded] = useState(false)
  const [selectorClean, setSelectorClean] = useState(true)
  const [leaugues, teams, setLeagues, setTeams] = useLeaguesAndTeamsHook(user, accessToken);
  const footerToolbar = {
    left: 'prev,next',
    center: "",
    right: 'dayGridDay,timeGridFourDay,dayGridWeek,dayGridMonth'
  }
  const headerToolbar = {
    center: 'title',left: "prev,next", right: "today"
  }
  const fc_custom_views = {
    timeGridFourDay: {
      type: 'dayGrid',
      duration: { days: 4 },
      slotEventOverlap: true,
      allDaySlot: false,
      nowIndicator: true,
    }
  }
  const events = []
  var date = new Date()
  const scrollTime = date.toTimeString().split(' ')[0]
  for(var i =0; i < games.length; i++){
    var title = games[i].home_team_name.toString() + " vs. " + games[i].away_team_name.toString() 
    var start = new Date(games[i].start) || null
    if(start)
      events.push({
        title: title,
        start: start
      })
  }
  const toggleSelectorExpanded = () => {
    if(selectorClean){
      setSelectorClean((prevValue) => false)
      //get teams
      var request_data2 = build_get_leagues_or_teams_request(user, 'teams', accessToken);
      fetch(request_data2.url, request_data2.options)
          .then(response2 => {
              if(response2.status == 200) 
                  return response2.json()
              else
                  throw("not valid")
          })
          .then(data => {
              console.log("teams data retrieved:", data)
              setTeams(prev => data.teams || []);
          })
          .catch(error => console.error("Error saving user data:", error));
    }
    setSelectorExpanded(() => !selectorExpanded)
  }
  return(
    <div>
      <div className="editor-and-calendar">
        <div className="schedule-header-account-favorites">  
          <span className="schedule-and-edit">
            <div>
              <span className="fav-select-header-and-toggle">
                <button onClick={(e) => toggleSelectorExpanded()}>
                  <i className="fa fa-pencil" />
                </button>
              </span>
            </div>  
          </span>
          <AccountFavorites />

        </div>
        <hr id='padded-hr'/>
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
          <h1 className="watchlist-header">
            Schedule
          </h1>
          <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin]}
              initialView='timeGridFourDay'
              nowIndicator={true}
              weekends={true}
              // expandRows={true}
              footerToolbar={footerToolbar}
              eventDisplay="block"
              events={events}
              eventContent={renderEventContent}
              eventOverlap={false}
              headerToolbar={headerToolbar}
              views={fc_custom_views}
              themeSystem="bootstrap5"
              scrollTime={scrollTime}
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