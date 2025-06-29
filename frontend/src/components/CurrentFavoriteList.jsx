import {useState, useEffect } from 'react'
import { useAuth } from '../contexts/auth_context.jsx'

const CurrentFavoriteList = ({which, favorites, setFavorites}) => {
    return(
        <div>
            {
                favorites[which] && favorites[which].length > 0 && favorites[which].map((team, index) => (
                    <span key={index} className="favorite-team">  
                        
                        {team.name}
                    </span>
                ))
            }
            { favorites[which] && favorites[which].length == 0 && <span className="dull empty-fav">Favorite some teams below!</span>}
        </div>
    )
}
export default CurrentFavoriteList