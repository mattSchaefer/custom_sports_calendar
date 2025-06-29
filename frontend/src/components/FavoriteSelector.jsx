import React from 'react';
import { useState, useEffect } from 'react';
import '../App.css';
import { useAuth } from '../contexts/auth_context.jsx';
//@which is favorite_leagues, favorite_teams, or added_teams
const FavoriteSelector = ({teams, league, index}) => {
    const filtered_teams = teams
    const { user, loginWithGoogle, loginWithFacebook, loading, signOut, accessToken, favorites, setFavorites, sync_favorites } = useAuth();
    const filter_by_term = (term) => {
        return filtered_teams.filter((team) => team.name.toLowerCase().includes(term.toLowerCase()));
    }
    //const [favorites, setFavorites, sync_favorites] = useUserFavoritesHook();
    const toggleFollowTeam = (e, team) => {
        const is_in = favorites.followed_teams.filter((fav) => { return fav.id == team.id}).length > 0
        //console.log(is_in)
        if(!is_in){
            //TODO: sync with server first?
            setFavorites((prevFavorites) => {
                return{
                    ...prevFavorites,
                    followed_teams: [...(prevFavorites.followed_teams || []), team],
                    on_load: false
                }
            })
        }
        else{
            setFavorites((prevFavorites) => {
                return{
                    ...prevFavorites,
                    followed_teams: [...(prevFavorites.followed_teams || []).filter((team2) => { return team2.id !== team.id})],
                    on_load: false
                }
            })
        }
    }
    return (
        <div className="avaliable-league" key={index}>
            <span className="league-header-span">
                <h5 className="league-name-header" key={index}>{league.name}</h5>
                <span>
                    <button><i className="fa fa-plus" /></button>
                    <button><i className="fa fa-search" /></button>
                </span>
            </span>
            <div className="league-teams">
                {
                    teams.map((team, teamIndex) => {
                        return (
                            <span key={teamIndex} className="team-name">
                                <h6 className="team-name-header">{team.name}</h6>
                                <span className="add-and-fav-button-container">
                                    <button className="team-add" onClick={(e) => toggleFollowTeam(e, team)}>
                                        {
                                            favorites.followed_teams.filter((fav) => { return fav.id == team.id}).length > 0 &&
                                            <i className="fa fa-minus" />
                                        }
                                        {
                                            favorites.followed_teams.filter((fav) => { return fav.id == team.id}).length == 0 &&
                                            <i className="fa fa-plus" />
                                        }
                                    </button>
                                   <button className="team-favorite"><i className="fa fa-star" /></button>
                                    
                                </span>
                            </span>
                        )
                    })
                }
            </div>
        </div>
    );
}
export default FavoriteSelector