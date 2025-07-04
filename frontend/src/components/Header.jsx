import { useState, useEffect, React } from 'react'
import '../App.css'
import { signInWithGoogle, signInWithFacebook, signInWithTwitter } from '../config/firebase/auth.js'
import { build_save_user_request } from '../factories/save_user_request_factory.js'
import { useAuth } from '../contexts/auth_context.jsx'
import logo from '../assets/dark_text_2.png'
import AccountDropdown from './AccountDropdown.jsx'

const Header = () => {
    const { user, loginWithGoogle, loginWithFacebook, loading, logOut } = useAuth();
    return (
        <header className="header">
            
            {
                (!user || !user.email) &&
                <span className="header-left">
                    <img src={logo} alt="SportSync Logo" className="logo" />
                    <a href="#about" className="header-link">About</a>
                    <a href="#about" className="header-link">Leagues</a>
                    <a href="#about" className="header-link">Princing</a>
                    <a href="#contact" className="header-link">Contact</a>
                </span>
            }
            {
                user && user.email &&
                <span className="header-left">
                    <img src={logo} alt="SportSync Logo" className="logo" />
                    <h4 class="white-text">Welcome back, {user.email}</h4>
                </span>
            }
            <AccountDropdown />
            
      
        </header>
    );
}
export default Header