import { useState, useEffect, React } from 'react'
import '../App.css'
import P5Canvas from './P5Canvas.jsx'
import { build_save_user_request } from '../factories/save_user_request_factory.js'
import { useAuth } from '../contexts/auth_context.jsx'
import { ThemeProvider } from '../contexts/theme_context.jsx'
import {useUserFavoritesHook} from '../hooks/UserFavoritesHook.jsx'
import about_1 from '../assets/about_1.png'
import CalendarWidget from './CalendarWidget.jsx'
import AccountDetails
 from './AccountDetails.jsx'
import { Theme } from '@fullcalendar/core/internal'
const SignedInHome = ({}) => {
    const { user, loginWithGoogle, loginWithFacebook, loading, signOut, accessToken, favorites, setFavorites, sync_favorites, games, setGames } = useAuth();
    //const [favorites, setFavorites] = useUserFavoritesHook(user, accessToken);
    //console.log(user)
    return(
        <div className="signed-in-home-container">
           
            {/* <span className="outer-account-info-container">
                <h4>Account Info</h4>
                <div className="account-info-container">
                    <span>phone: {user.phone}</span>
                    <span>account type: {user.account_type || 'basic'}
                        <button>upgrade!</button>
                    </span>
                </div>
               
            </span> */}
            <ThemeProvider>
                <AccountDetails favorites={favorites} setFavorites={setFavorites} sync_favorites={sync_favorites} games={games} setGames={setGames} />
                <CalendarWidget favorites={favorites} setFavorites={setFavorites} games={games} setGames={setGames}  />
            </ThemeProvider>
        </div>
    )
}
export default SignedInHome;