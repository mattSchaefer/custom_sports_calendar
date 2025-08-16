import React from 'react';
import { useState, useEffect } from 'react';
import '../App.css';
import { useAuth } from '../contexts/auth_context.jsx';
//@which is favorite_leagues, favorite_teams, or added_teams
const FavoriteSelector = ({teams, league, index}) => {
    //let filtered_teams = teams
    let [filteredTeams, setFilteredTeams] = useState(teams)
    const [showInput, setShowInput] = useState(false)
    useEffect(() => {if(filteredTeams.length == 0){setFilteredTeams(() => teams)}},[teams])
    useEffect(() => {
        var tooltips = document.querySelectorAll("follow-team-tooltip")
        tooltips.forEach((tooltip) => {
            //tooltip.classList.add('hidden')
            document.getElementById(tooltip.id).classList.add('hidden')
        })
        if(showInput){
            
            setTimeout(() => {
                const input = document.querySelector('#filter-input-' + league.id.replaceAll(' ', '-'));
                if(input) input.focus();
            }, 100);
        }
    }, [showInput])
    const { user, loginWithGoogle, loginWithFacebook, loading, logOut, accessToken, favorites, setFavorites, sync_favorites, games, setGames, cfbRankings, setCfbRankings } = useAuth();
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
    const toggleShowTooltip = (e, which, mouse_ac) => {
        if(mouse_ac == "enter"){
            document.getElementById(which).classList.remove('hidden')
        }else{
            document.getElementById(which).classList.add('hidden')
        }
        if(which.indexOf('search') >= 0 && showInput)
            return
        // if(document.getElementById(which).classList.contains('hidden')){
        //     document.getElementById(which).classList.remove('hidden')
        // }else{
        //     document.getElementById(which).classList.add('hidden')
        // }
    }
    console.log(filteredTeams)
    return (
        <div className="avaliable-league" key={index}>
            <span className="league-header-span">
                
                <h3 className="league-name-header" key={index}>{league.name}</h3>
                {
                    teams.length > 0 &&
                    <span className="favorite-selector-header-buttons">
                        
                        { 
                            league.id !== "NCAAF" && league.name !== "MLB"
                            &&
                            <button  
                                onClick={(e) => toggleFollowLeague(e, league)} 
                                className="favorite-selector-follow-league-button" 
                                onMouseEnter={(e) => toggleShowTooltip(e, "follow-tooltip-" + league.id, "enter")}
                                onMouseLeave={(e) => toggleShowTooltip(e, "follow-tooltip-" + league.id, "exit")}
                            >
                                {
                                    favorites.followed_leagues.filter((fav) => { return fav.id == league.id}).length > 0 && league.id !== "NCAAF" &&
                                    <i className="fa fa-minus" />
                                }
                                {
                                    favorites.followed_leagues.filter((fav) => { return fav.id == league.id}).length == 0 && league.id !== "NCAAF" &&
                                    <i className="fa fa-plus" />
                                }
                            </button>
                        }
                        <span class="follow-team-tooltip hidden" id={"follow-tooltip-" + league.id }>
                            <i className="fa fa-chevron-left" />{favorites.followed_leagues.filter((fav) => { return fav.id == league.id}).length > 0 ? "   unfollow " + league.name : "   follow " + league.name}
                        </span>
                        {/* <Tooltip id="search-league-tooltip" /> */}
                        <button 
                            onClick={(e) => setShowInput((prev) => !prev)} 
                            className="favorite-selector-search-button"
                            onMouseEnter={(e) => toggleShowTooltip(e, "search-tooltip-" + league.id, "enter")}
                            onMouseLeave={(e) => toggleShowTooltip(e, "search-tooltip-" + league.id, "exit")}
                        >
                            <i className="fa fa-search" />
                        </button>
                         
                            
                        
                        {
                            showInput &&
                            <input className="favorite-selector-filter-input" id={"filter-input-" + league.id.replaceAll(' ', '-')} onChange={(e) => filter_by_term(e)} placeholder="filter by team name..." />
                            // favorite-selector-filter-input
                        }
                        {
                            !showInput &&
                            <span class="follow-team-tooltip hidden" id={"search-tooltip-" + league.id }>
                                <i className="fa fa-chevron-left" />{"search " + league.name}
                            </span>
                        }
                    </span>
                }
            </span>
            {
                //teams.length > 0 &&
                <div className="league-teams">
                    {
                        teams.length == 0 &&
                        <span className="no-teams-found big-toggle-follow-button-container">
                            <span class="follow-team-tooltip-big hidden" id={"follow-league-tooltip-" + league.id + "-large"}>
                                <i className="fa fa-chevron-down" />{"follow " + league.name}
                            </span>
                            <button  
                                onClick={(e) => toggleFollowLeague(e, league)} 
                                className="favorite-selector-follow-league-button big-toggle-follow-league"
                               
                            >
                                {
                                    favorites.followed_leagues.filter((fav) => { return fav.id == league.id}).length > 0 && league.id !== "NCAAF" &&
                                    <i className="fa fa-minus" />
                                }
                                {
                                    favorites.followed_leagues.filter((fav) => { return fav.id == league.id}).length == 0 && league.id !== "NCAAF" &&
                                    <i className="fa fa-plus" />
                                }
                            </button>
                        </span>
                    }
                    {
                        filteredTeams.map((team, teamIndex) => {
                            return (
                                <span key={teamIndex} className="team-name">{/*className='team-name'*/}
                                    <h5 className={favorites.favorite_teams.filter((fav) => { return fav.id == team.id}).length > 0 ? 'favorite-team-highlight team-name-header' : 'team-name-header' }>
                                        
                                        {team.name} 
                                        {
                                           team.rank &&
                                           <span className="rank">
                                                {team.rank}
                                           </span>
                                        }
                                    </h5>
                                    <span className="add-and-fav-button-container">
                                         <span class="follow-team-tooltip hidden" id={"follow-tooltip-" + team.id}>
                                            {favorites.followed_teams.filter((fav) => { return fav.id == team.id}).length > 0 ? "unfollow " + team.name : "follow " + team.name}
                                            <i className="fa fa-chevron-right" />
                                         </span>
                                        <button 
                                            className="team-add" 
                                            onClick={(e) => toggleFollowTeam(e, team)}
                                            onMouseEnter={(e) => toggleShowTooltip(e, "follow-tooltip-" + team.id, "enter")}
                                            onMouseLeave={(e) => toggleShowTooltip(e, "follow-tooltip-" + team.id, "exit")}
                                        >
                                            {
                                                favorites.followed_teams.filter((fav) => { return fav.id == team.id}).length > 0 &&
                                                <i className="fa fa-minus" />
                                            }
                                            {
                                                favorites.followed_teams.filter((fav) => { return fav.id == team.id}).length == 0 &&
                                                <i className="fa fa-plus" />
                                            }
                                        </button>
                                        <span class="follow-team-tooltip hidden" id={"favorite-tooltip-" + team.id}>
                                            {favorites.favorite_teams.filter((fav) => { return fav.id == team.id}).length > 0 ? "unfavorite " + team.name : "favorite " + team.name}
                                            <i className="fa fa-chevron-right" />
                                         </span>
                                        <button 
                                            className="team-favorite" 
                                            onClick={(e) => toggleFavoriteTeam(e, team)}
                                            onMouseEnter={(e) => toggleShowTooltip(e, "favorite-tooltip-" + team.id, "enter")}
                                            onMouseLeave={(e) => toggleShowTooltip(e, "favorite-tooltip-" + team.id, "exit")}
                                        >
                                            <i className={favorites.favorite_teams.filter((fav) => { return fav.id == team.id}).length > 0 ? 'favorite-team-highlight fa fa-star' : 'fa fa-star' } />
                                        </button>
                                    </span>
                                </span>
                            )
                        })
                    }
                </div>
            }
        </div>
    );
}
export default FavoriteSelector