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
    const [leaugues, teams] = useLeaguesAndTeamsHook(user, accessToken);
    //const [favorites, setFavorites, sync_favorites] = useUserFavoritesHook(user, accessToken)
    return(
        <div className="account-favorites">
            <h3 className="watchlist-header">Calendar Configuration</h3>
            <p className="account-favorites-paragraph">Follow entire leagues, or specific teams.</p>
            <p className="account-favorites-paragraph">Teams you favorite are stand out amongst the rest of your schedule</p>
            <div className="favorite-teams-and-leagues">
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
            <div className="avaliable-leagues-container">
                <h3>Avaliable Leagues</h3>
                <div className="avaliable-leagues-inner">
                    {
                        leaugues.map((league, index) => (
                            
                            <FavoriteSelector league={league} teams={teams.filter((team) => team.league == league.name)} key={index} user={user} accessToken={accessToken} setFavorites={setFavorites} favorites={favorites} />
                        ))
                    }
                </div>
            </div>
            <h4>Synced Teams</h4>
            <ul></ul>
        </div>
    )
}
export default AccountFavorites