import React from 'react'
import { useState, useEffect } from 'react'
import '../App.css'
import { useAuth } from '../contexts/auth_context.jsx'
import AccountDetails from './AccountDetails.jsx'
import AccountFavorites
 from './AccountFavorites.jsx'
const CalendarWidget = () => {
    const { user, loginWithGoogle, loginWithFacebook, loading, signOut } = useAuth()

    return(
        <div>
            <h3>Watchlist</h3>
            <div>
                <AccountFavorites />
            </div>
        </div>
    )
}
export default CalendarWidget