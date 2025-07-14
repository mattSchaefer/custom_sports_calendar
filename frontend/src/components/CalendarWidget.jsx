import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import '../App.css'
import { useAuth } from '../contexts/auth_context.jsx'
import useLeaguesAndTeamsHook from '../hooks/LeaguesAndTeamsHook.jsx';
import FavoriteSelector from './FavoriteSelector.jsx';
import { build_get_leagues_or_teams_request } from '../factories/get_leagues_or_teams_request_factory.js';
import { build_get_user_schedule_daterange_request } from '../factories/get_user_schedule_daterange_request_factory.js';
import AccountDetails from './AccountDetails.jsx'
import AccountFavorites from './AccountFavorites.jsx'
import CalendarEvent from './CalendarEvent.jsx'
const CalendarWidget = () => {
  const { user, loginWithGoogle, loginWithFacebook, loading, logOut, accessToken, favorites, setFavorites, sync_favorites, games, setGames  } = useAuth()
  const [selectorExpanded, setSelectorExpanded] = useState(false)
  const [selectorClean, setSelectorClean] = useState(true)
  const [scheudleRequestLoading, setScheduleRequestLoading] = useState(false)
  const [leaugues, teams, setLeagues, setTeams] = useLeaguesAndTeamsHook(user, accessToken);
  const footerToolbar = {
    left: 'dayGridDay,timeGridFourDay',
    center: "",
    right: 'dayGridWeek,dayGridMonth'
  }
  const headerToolbar = {
    center: 'title',left: "today", right: "prev,next"
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
  let isFavoriteTeam = (team_id) => {
    const is_favorite = favorites.favorite_teams.filter((fav_team) => fav_team.id == team_id).length > 0
    return is_favorite
  }
  let isFollowedTeam = (team_id) => {
    const is_followed = favorites.followed_teams.filter((fav_team) => fav_team.id == team_id).length > 0
    return is_followed
  }  
  const transformGames = (games) => {
    const events = []
    for(var i =0; i < games.length; i++){
      var this_game = games[i]
      var title = games[i].home_team_name.toString() + " vs. " + games[i].away_team_name.toString() 
      var start = new Date(games[i].start) || null
      if(start){
        events.push({
          title: title,
          start: start,
          league: games[i].league_name,
          home_team:
            {
              id: games[i].home_team_id,
              name: games[i].home_team_name,
              is_favorite: isFavoriteTeam(games[i].home_team_id),
              is_followed: isFollowedTeam(games[i].home_team_id)
            },
          away_team:  
            {
              id: games[i].away_team_id,
              name: games[i].away_team_name,
              is_favorite: isFavoriteTeam(games[i].away_team_id),
              is_followed: isFollowedTeam(games[i].away_team_id)
            },
          is_favorite: isFavoriteTeam(games[i].home_team_id) || isFavoriteTeam(games[i].away_team_id)
        })
      }
    }
    return events
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
  const dateChangeHandler = useCallback(async (fetchInfo, successCallback, failureCallback) => {
    setScheduleRequestLoading(true)
    try{
      var request_data = build_get_user_schedule_daterange_request(user, accessToken, fetchInfo.startStr.toString(), fetchInfo.endStr.toString());
      const res = await fetch(request_data.url, request_data.options)
      if(res.status == 200) {
        const data = await res.json()
        const events = transformGames(data.games || [])
        successCallback(events)
      } else {
        failureCallback(res.statusText)
      }
    }catch(error){
      failureCallback(error)
    }finally{
      setScheduleRequestLoading(false)
    }
  },[user, accessToken, favorites, setFavorites, games, setGames]);
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
        {
          selectorExpanded &&
          <div className="avaliable-leagues-container">
            <div className="avaliable-leagues-inner">
              <span className="fav-select-header-and-toggle close-list-editor">
                <button onClick={(e) => toggleSelectorExpanded()}>
                  <i className="fa fa-close" />
                </button>
              </span>
              <span className="edit-lists-verbiage">
                <h4>Edit lists</h4>
                <p>Use the controls below to manage your favorite and followed teams and leagues</p>
              </span>
              <div className="favorite-selector-maps-container">
                {
                  leaugues.map((league, index) => (  
                    <FavoriteSelector league={league} teams={teams.filter((team) => team.league_id == league.id)} key={index} user={user} accessToken={accessToken} setFavorites={setFavorites} favorites={favorites} />
                  ))
                }
              </div>
            </div>
          </div>
        }
        <div className="full-calendar-container">
          <h1 className="watchlist-header">
            Schedule {scheudleRequestLoading && <span className="loading-spinner"><i className="fa fa-spinner fa-spin" /></span>} {scheudleRequestLoading}
          </h1>
          <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin]}
              initialView='timeGridFourDay'
              nowIndicator={true}
              weekends={true}
              footerToolbar={footerToolbar}
              eventDisplay="block"
              events={dateChangeHandler}
              eventContent={renderEventContent}
              eventOverlap={false}
              headerToolbar={headerToolbar}
              views={fc_custom_views}
              stickyHeaderDates={true}
              lazyFetching={true}
          />
        </div>
      </div>
    </div>
  )
}
function renderEventContent(eventInfo) {
  
  return (
    <CalendarEvent eventInfo={eventInfo} />
  )
}
export default CalendarWidget