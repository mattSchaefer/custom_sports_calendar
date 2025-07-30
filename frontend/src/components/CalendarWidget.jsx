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
  const { user, loginWithGoogle, loginWithFacebook, loading, logOut, accessToken, favorites, setFavorites, sync_favorites, games, setGames, cfbRankings, setCfbRankings  } = useAuth()
  const [selectorExpanded, setSelectorExpanded] = useState(false)
  const [selectorClean, setSelectorClean] = useState(true)
  const [scheudleRequestLoading, setScheduleRequestLoading] = useState(false)
  const [leaugues, teams, setLeagues, setTeams] = useLeaguesAndTeamsHook(user, accessToken);
  
  const headerToolbar = {
    center: 'title',left: "today", right: "prev,next"
  }
  // const fc_custom_views = {
  //   timeGridFourDay: {
  //     type: 'dayGrid',
  //     duration: { days: 4 },
  //     slotEventOverlap: true,
  //     allDaySlot: false,
  //     nowIndicator: true,
  //     buttonText: '4 Day',
  //   }
    
  // }
  // const fc_mobile_views = {
  //   timeGridThreeDay: {
  //     type: 'dayGrid',
  //     duration: { days: 3 },
  //     slotEventOverlap: true,
  //     allDaySlot: false,
  //     nowIndicator: true,
  //     buttonText: '3 Day',
  //   },
  //   timeGridTwoDay: {
  //     type: 'dayGrid',
  //     duration: { days: 2 },
  //     slotEventOverlap: true,
  //     allDaySlot: false,
  //     nowIndicator: true,
  //     buttonText: '2 Day',
  //   }
  // }
  const is_mobile = window.innerWidth < 768
  const fc_custom_views = {
    timeGridThreeDay: {
      type: 'dayGrid',
      duration: { days: 3 },
      slotEventOverlap: true,
      allDaySlot: false,
      nowIndicator: true,
      buttonText: '3 day',
      },
      timeGridTwoDay: {
        type: 'dayGrid',
        duration: { days: 2 },
        slotEventOverlap: true,
        allDaySlot: false,
        nowIndicator: true,
        buttonText: '2 day',
      },
      timeGridFourDay: {
        type: 'dayGrid',
        duration: { days: 4 },
        slotEventOverlap: true,
        allDaySlot: false,
        nowIndicator: true,
        buttonText: '4 day',
      }
  }
  const footerToolbar = {
    left: 'dayGridDay,timeGridTwoDay,timeGridThreeDay,timeGridFourDay,dayGridWeek,dayGridMonth',
    center: "",
    right: ''
  }
  const mobileFooterToolbar = {
    left: 'dayGridDay,timeGridTwoDay,timeGridThreeDay,timeGridFourDay',
    center: "",
    right: ''
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
      console.log(games[i].start.split("T")[1])
      var time = games[i].start.split("T")[1]
      var date_time
      if(time == "00:00:00Z"){
        date_time = games[i].start.split("T")[0]
        
      }
      else
        date_time = games[i].start
      var start = new Date(date_time) || null
      var team_event = games[i].home_team_id !== null
      if(start && team_event){
        var title = games[i].home_team_name.toString() + " vs. " + games[i].away_team_name.toString() 
        var team_already_in_for_this_time = events.filter((event) => {
          return event.start.getTime() == start.getTime() && (event.home_team.id == games[i].home_team_id || event.away_team.id == games[i].away_team_id)
        }).length > 0
        if(!team_already_in_for_this_time){
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
      }else if(start && !team_event){
        var title = games[i].strEvent
        events.push({
          title: title,
          start: start,
          league: games[i].league_name,
          home_team: {
            id: null,
            name: null,
            is_favorite: false,
            is_followed: false
          },
          away_team: {
            id: null,
            name: null,
            is_favorite: false,
            is_followed: false
          },
          is_favorite: false,
          all_day: games[i].start.split("T")[1] == "00:00:00Z"
        })
      }
    }
    return events
  }
  const dateChangeHandler = useCallback(async (fetchInfo, successCallback, failureCallback) => {
    setScheduleRequestLoading(true)
    try{
      var request_data = build_get_user_schedule_daterange_request(user, accessToken, fetchInfo.startStr.toString(), fetchInfo.endStr.toString());
      const res = await fetch(request_data.url, request_data.options)
      if(res.status == 200) {
        const data = await res.json()
        console.log(data.games)
        const events = transformGames(data.games || [])
        console.log("transformed events: ")
        console.log(events)
        successCallback(events)
      } else {
        console.log(res)
        if(res.status == 401) {
          alert("session expired- please refresh the page to log in again.")
          failureCallback("Unauthorized access. Please log in again.")
        }
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
        <div className="full-calendar-container">
          <h1 className="watchlist-header">
            Schedule {scheudleRequestLoading && <span className="loading-spinner"><i className="fa fa-spinner fa-spin" /></span>} {scheudleRequestLoading}
          </h1>
          <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin]}
              initialView='timeGridFourDay'
              nowIndicator={true}
              weekends={true}
              footerToolbar={is_mobile ? mobileFooterToolbar : footerToolbar}
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