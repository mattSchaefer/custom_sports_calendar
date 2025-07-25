import React from 'react';
import {useState, useEffect} from 'react';
import '../App.css';
import { useAuth } from '../contexts/auth_context.jsx';
import {build_delete_user_request} from '../factories/delete_user_request_factory.js';
const accountDropdown = () => {
    const { user, loginWithGoogle, loginWithFacebook, loading, logOut, accessToken } = useAuth()
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
        <div className="dropdown">  
            <div className="dropdown-toggle" id="account-dropdown-toggle" onClick={toggleDropdownShow}>
                {
                    user &&
                    <i className="fa fa-user-circle" />
                }
            </div>
            {
                user && dropdownShow &&
                <div>
                    <p className="text-2xl font-bold">{user && user.email && (<span>{user.email}</span>)}</p>
                    <a href="#about" className="header-link">Upgrade account</a>
                    <button onClick={() => deleteAccount()}><i className="fa fa-warning" />delete account</button>
                    <button onClick={ ()=>logOut()}>sign out<i className="fa fa-sign-out" /></button>
                </div>
            }
            {
                !user &&
                <div>
                    <button className="header-btn button-85" onClick={() => loginWithGoogle()}>{/*handleLogin(signInWithGoogle) */}
                        <i className="fa fa-brands fa-google"></i>
                        Sign in with Google
                    </button>
                    <button className="header-btn button-85" onClick={() => loginWithFacebook()}>
                        <i className="fa fa-brands fa-facebook"></i>
                        Sign in with Facebook
                    </button>
                </div>
            }
        </div>
    )
}

export default accountDropdown