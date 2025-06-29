import {useEffect, useState, useRef} from 'react'
import { build_set_favorite_request } from '../factories/set_favorite_or_follow_request_factory';
import { useAuth } from '../contexts/auth_context.jsx';

const useUserFavoritesHook = (user, accessToken) => {
    const firstRenderFollowedTeams = useRef(true)
    const [favorites, setFavorites] = useState({
        favorite_teams: [],
        followed_teams: [],
        followed_leagues: [],
        on_load: true
    });
    const sync_favorites = (which, teams_or_leagues) => {
        if (!user || !accessToken) return;
        const request_data = build_set_favorite_request(user, accessToken, which, teams_or_leagues);
        console.log(request_data)
        fetch(request_data.url, request_data.options)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw response
                }
            })
            .then(data => {
                console.log("Favorites updated successfully:", data);
                // setFavorites(prevFavorites => ({
                //     ...prevFavorites,
                //     [which]: teams_or_leagues
                // }));
            })
            .catch(error => console.error("Error updating favorites:", error));
    }
    useEffect(() => {
        
        if (!user) {
            console.log('init set favorites access token ' + accessToken)
            
        }
    }, [user]);
    useEffect(() => {
        if(firstRenderFollowedTeams.current){
            firstRenderFollowedTeams.current = false
            return
        }
        // console.log(favorites.on_load)
        if(!favorites.on_load)
            sync_favorites("followed_teams", favorites["followed_teams"] || [])
    
    },[favorites.followed_teams])
    return [favorites, setFavorites, sync_favorites];
}
export {useUserFavoritesHook}