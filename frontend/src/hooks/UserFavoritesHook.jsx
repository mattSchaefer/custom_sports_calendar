import {useEffect, useState, useRef} from 'react'
import { build_set_favorite_request } from '../factories/set_favorite_or_follow_request_factory';
import { useAuth } from '../contexts/auth_context.jsx';

const useUserFavoritesHook = (user, accessToken) => {
    const firstRenderFollowedTeams = useRef(true)    
    const firstRenderFavoriteTeams = useRef(true)
    const firstRenderFollowedLeagues = useRef(true)
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
                console.log("Favorites updated successfully");
            })
            .catch(error => console.error("Error updating favorites:", error));
    }
    
    useEffect(() => {
        if(firstRenderFollowedTeams.current){
            firstRenderFollowedTeams.current = false
            return
        }
        if(!favorites.on_load)
            sync_favorites("followed_teams", favorites["followed_teams"] || [])
    
    },[favorites.followed_teams])
    useEffect(() => {
        if(firstRenderFollowedLeagues.current){
            firstRenderFollowedLeagues.current = false
            return
        }
        if(!favorites.on_load)
            sync_favorites("followed_leagues", favorites["followed_leagues"] || [])
    
    },[favorites.followed_leagues])
    useEffect(() => {
        if(firstRenderFavoriteTeams.current){
            firstRenderFavoriteTeams.current = false
            return
        }
        // console.log(favorites.on_load)
        if(!favorites.on_load)
            sync_favorites("favorite_teams", favorites["favorite_teams"] || [])
    
    },[favorites.favorite_teams])

    return [favorites, setFavorites, sync_favorites];
}
export {useUserFavoritesHook}