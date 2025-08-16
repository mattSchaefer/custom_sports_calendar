import React from 'react';
import {useState, useEffect} from 'react';
import '../App.css';
import { useAuth } from '../contexts/auth_context.jsx';
import {build_delete_user_request} from '../factories/delete_user_request_factory.js';
import google_icon from '../assets/login_google.svg'

const accountDropdown = () => {
    const { user, loginWithGoogle, loginWithFacebook, loading, logOut, accessToken , loginWithTwitter} = useAuth()
    const [dropdownShow, setDropdownShow] = useState(false)
    const toggleDropdownShow = () => {
        setDropdownShow(!dropdownShow);
    }
    const deleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
           //logOut()
           const req_user = {
                uid: user.uid,
                accessToken: accessToken
           } 
           const request = build_delete_user_request(req_user);
              console.log("Delete user request:", request);
            fetch(request.url, request.options)
            .then((response) => {
                return response.json()
            })
            .then((json) => {
                console.log("Delete user response:", json);
                alert("Your account has been deleted.");
                logOut()
            })
        }
    }
    return (
        <div className={user ? "dropdown": ""}>  
            {
                 user &&
                <button className="dropdown-toggle" id="account-dropdown-toggle" onClick={toggleDropdownShow}>
                
                   
                    <span>
                        <i className="fa fa-chevron-down" />
                        <i className="fa fa-user-circle" />
                    </span>
                
            </button>
            }
            {
                user && dropdownShow &&
                <div className="dropdown-content">
                    <span className="account-dropdown-text">
                        <p className="account-attr"><b>provider</b>: {user && user.provider && (<span>{user.provider}</span>)}</p>
                        <p className="account-attr"><b>username</b>: {user && user.provider_display_name && (<span>{user.provider_display_name}</span>)}</p>
                        <p className="account-attr"><b>email</b>: {user && user.provider_email && (<span>{user.provider_email}</span>)}</p>
                    </span>
                    <hr />
                    {/* <a href="#about" className="header-link">Upgrade account</a> */}
                    <button onClick={ ()=>logOut()} className="signout-button account-dropdown-button">sign out<i className="fa fa-sign-out" /></button>
                    <button onClick={() => deleteAccount()} className="delete-account-button account-dropdown-button"><i className="fa fa-warning" />delete account</button>
                    
                </div>
            }
            {
                !user &&
                <div className="unauth-home-login-container">
                    <button className="header-btn fade-in-on-scroll " onClick={() => loginWithGoogle()}>{/*handleLogin(signInWithGoogle) */}
                        <span className="login-button-highlight login-button-inner-span google-login-highlight">
                            <i className="fa fa-brands fa-google"></i>
                            sign in
                        </span>
                        {/* <img src={google_icon} alt="Google login" className="google-login-icon" /> */}
                    </button>
                    {/* <div class="fb-login-button" data-width="" data-size="medium" data-button-type="" data-layout="" data-auto-logout-link="false" data-use-continue-as="false"></div> */}
                    <button className="header-btn fade-in-on-scroll" onClick={() => loginWithFacebook()}>
                        <span className="login-button-highlight login-button-inner-span facebook-login-highlight">
                            <i className="fa fa-brands fa-facebook"></i>
                            sign in
                        </span>
                    </button>
                    <button className="header-btn fade-in-on-scroll" onClick={() => loginWithTwitter()}>
                        <span className="login-button-highlight login-button-inner-span x-login-highlight">
                            <i className="fa fa-brands fa-x-twitter"></i>
                            sign in 
                            {/* {"("}Twitter{")"} */}
                        </span>
                    </button>
                </div>
            }
        </div>
    )
}

export default accountDropdown