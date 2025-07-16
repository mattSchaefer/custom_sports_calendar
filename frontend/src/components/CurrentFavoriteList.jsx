import {useState, useEffect } from 'react'
import { useAuth } from '../contexts/auth_context.jsx'

const CurrentFavoriteList = ({which, favorites, setFavorites}) => {
    return(
        <div className="user-favorite-attr-list">
            {
                favorites[which] && favorites[which].length > 0 && favorites[which].map((team, index) => (
                    <span key={index} className={which == 'favorite_teams' ? "favorite-team-highlight current-team-list-ele" : which == "followed_teams" ? "followed-team current-team-list-ele" : "followed-league current-team-list-ele"}>  {/**className="favorite-team" */}
                        
                        {team.name + ", "}
                    </span>
                ))
            }
            { favorites[which] && favorites[which].length == 0 && <span className="dull empty-fav">Favorite some teams below!</span>}
        </div>
    )
}
export default CurrentFavoriteList