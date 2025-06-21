import React from 'react'
import { useState, useEffect } from 'react'
import '../App.css'
import { useAuth } from '../contexts/auth_context.jsx'

const CalendarWidget = () => {
    const { user, loginWithGoogle, loginWithFacebook, loading, signOut } = useAuth()

    return(
        <div>
            <h3>Calendar Widget</h3>

        </div>
    )
}
export default CalendarWidget