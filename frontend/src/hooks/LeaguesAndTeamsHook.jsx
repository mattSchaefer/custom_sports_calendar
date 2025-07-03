import React from 'react'
import { useState, useEffect } from 'react'
import { build_get_leagues_or_teams_request } from '../factories/get_leagues_or_teams_request_factory.js';

const useLeaguesAndTeamsHook = (user, accessToken) => {
    const [leaugues, setLeagues] = useState([]);
    const [teams, setTeams] = useState([]);
    useEffect(() => {
        //console.log('User data account favorites:', user);
        var request_data = build_get_leagues_or_teams_request(user, 'leagues', accessToken);
        //console.log("Request data:", request_data);
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
                    setLeagues(prev => data.leagues || []);
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
                    setTeams(prev => data.teams || []);
                })
                .catch(error => console.error("Error saving user data:", error));
        }
    }, []);
    return [leaugues, teams];
}
export default useLeaguesAndTeamsHook