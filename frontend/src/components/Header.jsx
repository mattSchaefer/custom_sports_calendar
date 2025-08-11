import { useState, useEffect, React } from 'react'
import '../App.css'
import { signInWithGoogle, signInWithFacebook, signInWithTwitter } from '../config/firebase/auth.js'
import { build_save_user_request } from '../factories/save_user_request_factory.js'
import { useAuth } from '../contexts/auth_context.jsx'
// import logo from '../assets/dark_text_2.png'
import logo from '../assets/sportsynclogov1.svg'
import AccountDropdown from './AccountDropdown.jsx'
import AccountFavorites from './AccountFavorites.jsx'
import FavoriteSelectorModal from './FavoriteSelectorModal.jsx'
const Header = () => {
    const { user, loginWithGoogle, loginWithFacebook, loading, logOut, accessToken, favorites, setFavorites, sync_favorites, games, setGames  } = useAuth();
    
    return (
        <header className="header fade-in-on-scroll" id="header-home">
            
            {
                (!user || (!user.provider_email && !user.provider_display_name)) &&
                <span className="header-left">
                    <a href="#top"> <img src={logo} alt="SportSync Logo" className="logo" /></a>
                    <a href="#about-us" className="header-link about-header-link">About</a>
                    <a href="#leagues-home-anchor" className="header-link leagues-header-link">Leagues</a>
                    <a href="#contact" className="header-link contact-header-link" onClick={() => {document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });}}>Contact</a>
                </span>
            }
            {
                user && (user.provider_email || user.provider_display_name) &&
                <span className="header-left">
                    <img src={logo} alt="SportSync Logo" className="logo" />
                    <div className="favorite-selector-modal-and-account-favorites">
                        <FavoriteSelectorModal />
                        <AccountFavorites />
                    </div>
                    {/* <h4 class="">Welcome back, {user.displayName}</h4> */}
                </span>
            }
            <AccountDropdown />
        </header>
    );
}
export default Header