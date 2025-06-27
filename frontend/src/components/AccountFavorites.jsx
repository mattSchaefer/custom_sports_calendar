import React from 'react';
import { useAuth } from '../contexts/auth_context.jsx'; 
import '../App.css';
import { useState, useEffect } from 'react';
import { build_get_leagues_or_teams_request } from '../factories/get_leagues_or_teams_request_factory.js';
const AccountFavorites = () => { 
    const { user, loginWithGoogle, loginWithFacebook, loading, logOut, accessToken } = useAuth()
    const [leaugues, setLeagues] = useState([]);
    const [teams, setTeams] = useState([]);
    useEffect(() => {
        console.log('User data account favorites:', user);
        var request_data = build_get_leagues_or_teams_request(user, 'leagues', accessToken);
        console.log("Request data:", request_data);
        if (user) {
            fetch(request_data.url, request_data.options)
                .then(response => {
                    if(response.status == 200) 
                        return response.json()
                    else
                        throw("not valid")
                })
                .then(data => {
                    console.log("league data retrieved:", data)
                    setLeagues(data.leagues || []);
                })
                .catch(error => console.error("Error saving user data:", error));
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
                    setTeams(data.teams || []);
                })
                .catch(error => console.error("Error saving user data:", error));
        }
    }, []);
    return(
        <div>
            <h4>Favorite Teams</h4>
            <div>
                    {
                        user.favorite_teams && user.favorite_teams.length > 0 && user.favorite_teams.map((team, index) => (
                            <span key={index} className="favorite-team">  
                                
                                {team.name}
                            </span>
                        ))
                    }
                    <button><i className="fa fa-plus" /></button>
                </div>
            <h4>Favorite Leagues</h4>
            <div>
                <div>
                    {
                        user.favorite_leagues && user.favorite_leagues.length > 0 && user.favorite_leagues.map((league, index) => (
                            <span key={index} className="favorite-league">  
                                {league.name}
                            </span>
                        ))
                    }
                </div>
                <button><i className="fa fa-plus" /></button>
            </div>
            <div className="avaliable-leagues-container">
                <h5>Avaliable Leagues</h5>
                <div className="avaliable-leagues-inner">
                    {
                        leaugues.map((league, index) => (
                            <div className="avaliable-league" key={index}>
                                <span key={index}>{league.name}</span>
                                <div className="league-teams">
                                    {
                                        !teams || teams.length ==  0 &&
                                        <span className="no-teams">No teams available</span>
                                    }
                                    {
                                        teams.map((team, teamIndex) => {
                                            if (team.league === league.name) {
                                                return (
                                                    <span key={teamIndex} className="team-name">
                                                        {team.name + " | " + team.league}
                                                    </span>
                                                );
                                            }
                                            return null;
                                        })
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
                <span>
                <h5>Avaliable Teams</h5>
                <ul className="avaliable-teams">
                    {
                        teams.map((team, index) => (
                            <li key={index}>{team.name + " | " + team.league} </li>
                        ))
                    }
                </ul>
            </span>
            </div>
            <h4>Synced Teams</h4>
            <ul></ul>
        </div>
    )
}
export default AccountFavorites