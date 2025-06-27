import React from 'react';
import { useState, useEffect } from 'react';
import '../App.css';
import { useAuth } from '../contexts/auth_context.jsx';
//@which is favorite_leagues, favorite_teams, or added_teams
const FavoriteSelector = ({ leagues, teams, which }) => {
    const { user, loading } = useAuth();
    const handleRemoveFavorite = (favoriteId) => {
        if (!user || loading) return;
        //TODO: invoke modal to confirm removal
    }
    const list = []

    
    

    return (
        <div className="favorite-selector">
            <label htmlFor="favorite-select">Favorite:</label>
            <div id="favorite-select" value={selectedFavorite?.id || ''} onChange={handleFavoriteChange}>
                {
                    user[which].map(favorite => (
                        <span key={favorite.id} value={favorite.id}>
                            {favorite.name}
                            <button className="remove-favorite" onClick={() => handleRemoveFavorite(favorite.id)}>
                                <i className="fa fa-trash" />
                            </button>
                        </span>
                    ))
                }
            </div>
        </div>
    );
}
export default FavoriteSelector