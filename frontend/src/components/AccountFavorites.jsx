import React from 'react';
import { useAuth } from '../contexts/auth_context.jsx'; 
import '../App.css';
import { useState, useEffect } from 'react';
import { build_get_leagues_or_teams_request } from '../factories/get_leagues_or_teams_request_factory.js';
import useLeaguesAndTeamsHook from '../hooks/LeaguesAndTeamsHook.jsx';
import {useUserFavoritesHook}  from '../hooks/UserFavoritesHook.jsx';
import FavoriteSelector from './FavoriteSelector.jsx';
import CurrentFavoriteList from './CurrentFavoriteList.jsx';
const AccountFavorites = ({}) => { 
    const { user, loginWithGoogle, loginWithFacebook, loading, logOut, accessToken, favorites, setFavorites, sync_favorites } = useAuth()
    //const [leauges, teams, setLeagues, setTeams] = useLeaguesAndTeamsHook(user, accessToken)
    const [selectorExpanded, setSelectorExpanded] = useState(false)
    //const [favorites, setFavorites, sync_favorites] = useUserFavoritesHook(user, accessToken)
    useEffect(() => {
        const lists_width = document.getElementById("favorite-teams-and-leagues")?.offsetWidth || 0
        if(lists_width > document.body.offsetWidth - 150){
            document.getElementById("favorite-teams-and-leagues").classList.add("infinite-scroll")
        }
    },[])
    

    return(
        
    //    <div className="scroll-wrapper">
    //         <div id="favorite-teams-and-leagues" className="favorite-teams-and-leagues">
    //             <span className="favorite-teams">
    //                 <h4 className="fav-header">Favorite Teams</h4>
    //                 <CurrentFavoriteList which="favorite_teams" user={user} favorites={favorites} setFavorites={setFavorites} sync_favorites={sync_favorites} />
    //             </span>
    //             <span className="followed-teams">
    //                 <h4 className="fav-header">Followed Teams</h4>
    //                 <CurrentFavoriteList which="followed_teams" user={user} favorites={favorites} setFavorites={setFavorites} sync_favorites={sync_favorites}  />
    //             </span>
    //             <span className="followed-leagues">
    //                 <h4 className="fav-header">Followed Leagues</h4>
    //                 <CurrentFavoriteList which="followed_leagues" user={user} favorites={favorites} setFavorites={setFavorites} sync_favorites={sync_favorites}  />
    //             </span>
    //         </div>
    //     </div>
    <div className="scroll-wrapper">
        <div className="scroll-track">
            
            <div id="favorite-teams-and-leagues" className="favorite-teams-and-leagues">
                <span className="favorite-teams">
                    <h4 className="fav-header">Favorite Teams</h4>
                    <CurrentFavoriteList which="favorite_teams" user={user} favorites={favorites} setFavorites={setFavorites} sync_favorites={sync_favorites} />
                </span>
                <span className="followed-teams">
                    <h4 className="fav-header">Followed Teams</h4>
                    <CurrentFavoriteList which="followed_teams" user={user} favorites={favorites} setFavorites={setFavorites} sync_favorites={sync_favorites}  />
                </span>
                <span className="followed-leagues">
                    <h4 className="fav-header">Followed Leagues</h4>
                    <CurrentFavoriteList which="followed_leagues" user={user} favorites={favorites} setFavorites={setFavorites} sync_favorites={sync_favorites}  />
                </span>
            </div>

            {/* Duplicate for seamless loop */}
            {/* <div className="favorite-teams-and-leagues">
                <span className="favorite-teams">
                    <h4 className="fav-header">Favorite Teams</h4>
                    <CurrentFavoriteList which="favorite_teams" user={user} favorites={favorites} setFavorites={setFavorites} sync_favorites={sync_favorites} />
                </span>
                <span className="followed-teams">
                    <h4 className="fav-header">Followed Teams</h4>
                    <CurrentFavoriteList which="followed_teams" user={user} favorites={favorites} setFavorites={setFavorites} sync_favorites={sync_favorites}  />
                </span>
                <span className="followed-leagues">
                    <h4 className="fav-header">Followed Leagues</h4>
                    <CurrentFavoriteList which="followed_leagues" user={user} favorites={favorites} setFavorites={setFavorites} sync_favorites={sync_favorites}  />
                </span>
            </div> */}
        </div>
    </div>
        
    )
}
export default AccountFavorites