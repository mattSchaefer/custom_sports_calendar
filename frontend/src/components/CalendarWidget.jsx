import React from 'react'
import { useState, useEffect } from 'react'
import '../App.css'
import { useAuth } from '../contexts/auth_context.jsx'
import AccountDetails from './AccountDetails.jsx'
import AccountFavorites
 from './AccountFavorites.jsx'
const CalendarWidget = () => {
    const { user, loginWithGoogle, loginWithFacebook, loading, signOut, accessToken,  } = useAuth()

    return(
        <div>
            
            <div>
                <AccountFavorites />
            </div>
        </div>
    )
}
export default CalendarWidget