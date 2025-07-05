import { useState, useEffect, React } from 'react'
import '../App.css'
import P5Canvas from './P5Canvas.jsx'
import { build_save_user_request } from '../factories/save_user_request_factory.js'
import { useAuth } from '../contexts/auth_context.jsx'
import about_1 from '../assets/about_1.png'
import Home from './Home.jsx'
import SignedInHome from './SignedInHome.jsx'
const AppContainer = () => {
    const { user, loginWithGoogle, loginWithFacebook, loading, signOut } = useAuth();
    return(
        <div className="app-container">
            {
                user && 
                <SignedInHome />
            }
            {
                !user &&
                <Home />
            }
        </div>
    )
}

export default AppContainer;