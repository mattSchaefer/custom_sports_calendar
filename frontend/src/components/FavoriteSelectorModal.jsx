import React from 'react'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/auth_context.jsx'
import useLeaguesAndTeamsHook from '../hooks/LeaguesAndTeamsHook.jsx'
import { build_get_leagues_or_teams_request } from '../factories/get_leagues_or_teams_request_factory.js'
import FavoriteSelector from './FavoriteSelector.jsx'
const FavoriteSelectorModal = () => {
    const { user, loginWithGoogle, loginWithFacebook, loading, logOut, accessToken, favorites, setFavorites, sync_favorites, games, setGames  } = useAuth()
    const [selectorExpanded, setSelectorExpanded] = useState(false)
    const [selectorClean, setSelectorClean] = useState(true)
    const [scheudleRequestLoading, setScheduleRequestLoading] = useState(false)
    const [leaugues, teams, setLeagues, setTeams] = useLeaguesAndTeamsHook(user, accessToken)
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
        <div className="favorite-selector-modal">
            <div className="fav-select-header-and-toggle">
                
                <button className="toggle-fav-selector" onClick={() => toggleSelectorExpanded()}>
                    <i className="fa fa-chevron-down" />
                </button>
            </div>
            {
                selectorExpanded &&
                <div className="favorite-selector-modal-backdrop">
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
                </div>
            }
        </div>
    )
}
export default FavoriteSelectorModal