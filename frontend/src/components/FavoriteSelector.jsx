import React from 'react';
import { useState, useEffect } from 'react';
import '../App.css';
import { useAuth } from '../contexts/auth_context.jsx';
//@which is favorite_leagues, favorite_teams, or added_teams
const FavoriteSelector = ({teams, league, index}) => {
    //let filtered_teams = teams
    let [filteredTeams, setFilteredTeams] = useState(teams)
    useEffect(() => {if(filteredTeams.length == 0){setFilteredTeams(() => teams)}},[teams])
    const { user, loginWithGoogle, loginWithFacebook, loading, signOut, accessToken, favorites, setFavorites, sync_favorites } = useAuth();
    const filter_by_term = (e) => {
        var term = e.target.value.toString()
        setTimeout(() => {
            if(term == "" || !term)
                setFilteredTeams(() => teams)
            filteredTeams = teams.filter((team) => team.name.toString().toLowerCase().includes(term.toString().toLowerCase()));
            setFilteredTeams(() => filteredTeams)
            console.log(filteredTeams)
        },50)
        console.log(term)
        
    }
    const toggleFollowTeam = (e, team) => {
        const is_in = favorites.followed_teams.filter((fav) => { return fav.id == team.id}).length > 0
        if(!is_in){
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
    const toggleFavoriteTeam = (e, team) => {
        const is_in = favorites.favorite_teams.filter((fav) => { return fav.id == team.id}).length > 0
        if(!is_in){
            setFavorites((prevFavorites) => {
                return{
                    ...prevFavorites,
                    favorite_teams: [...(prevFavorites.favorite_teams || []), team],
                    on_load: false
                }
            })
        }
        else{
            setFavorites((prevFavorites) => {
                return{
                    ...prevFavorites,
                    favorite_teams: [...(prevFavorites.favorite_teams || []).filter((team2) => { return team2.id !== team.id})],
                    on_load: false
                }
            })
        }
    }
    const toggleFollowLeague = (e, league) => {
        const is_in = favorites.followed_leagues.filter((fav) => { return fav.id == league.id}).length > 0
        if(!is_in){
            setFavorites((prevFavorites) => {
                return{
                    ...prevFavorites,
                    followed_leagues: [...(prevFavorites.followed_leagues || []), league],
                    on_load: false
                }
            })
        }
        else{
            setFavorites((prevFavorites) => {
                return{
                    ...prevFavorites,
                    followed_leagues: [...(prevFavorites.followed_leagues || []).filter((league2) => { return league2.id !== league.id})],
                    on_load: false
                }
            })
        }
    }
    const [showInput, setShowInput] = useState(false)
    console.log(filteredTeams)
    return (
        <div className="avaliable-league" key={index}>
            <span className="league-header-span">
                <h3 className="league-name-header" key={index}>{league.name}</h3>
                <span className="favorite-selector-header-buttons">
                    <button  onClick={(e) => toggleFollowLeague(e, league)} className="favorite-selector-follow-league-button">
                        {
                            favorites.followed_leagues.filter((fav) => { return fav.id == league.id}).length > 0 &&
                            <i className="fa fa-minus" />
                        }
                        {
                            favorites.followed_leagues.filter((fav) => { return fav.id == league.id}).length == 0 &&
                            <i className="fa fa-plus" />
                        }
                    </button>
                    <button onClick={(e) => setShowInput((prev) => !prev)} className="favorite-selector-search-button">
                        <i className="fa fa-search" />
                    </button>
                    {
                        showInput &&
                        <input className="favorite-selector-filter-input" onChange={(e) => filter_by_term(e)} placeholder="filter by team name..." />
                        // favorite-selector-filter-input
                    }
                </span>
            </span>
            <div className="league-teams">
                {
                    filteredTeams.map((team, teamIndex) => {
                        return (
                            <span key={teamIndex} className="team-name">{/*className='team-name'*/}
                                <h5 className={favorites.favorite_teams.filter((fav) => { return fav.id == team.id}).length > 0 ? 'favorite-team-highlight team-name-header' : 'team-name-header' }>{team.name}</h5>
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
                                   <button className="team-favorite" onClick={(e) => toggleFavoriteTeam(e, team)}><i className={favorites.favorite_teams.filter((fav) => { return fav.id == team.id}).length > 0 ? 'favorite-team-highlight fa fa-star' : 'fa fa-star' } /></button>
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