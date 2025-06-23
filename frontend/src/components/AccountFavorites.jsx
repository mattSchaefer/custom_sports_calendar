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
                    setLeagues(data.teams || []);
                })
                .catch(error => console.error("Error saving user data:", error));
        }
    }, []);
    return(
        <div>
            <h4>Favorite Teams</h4>
           
            <h4>Favorite Leagues</h4>
            <ul></ul>
            <span>
                <h5>Avaliable Leagues</h5>
                <ul>
                    {
                    leaugues.map((league, index) => (
                        <li key={index}>{league.name}</li>
                    ))
                    }
                </ul>
            </span>
            <h4>Other Teams</h4>
            <ul></ul>
        </div>
    )
}
export default AccountFavorites