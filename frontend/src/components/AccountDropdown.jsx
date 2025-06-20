import React from 'react';
import {useState, useEffect} from 'react';
import '../App.css';
import { useAuth } from '../contexts/auth_context.jsx';
const accountDropdown = () => {
    const { user, loginWithGoogle, loginWithFacebook, loading, logOut } = useAuth()
    const [dropdownShow, setDropdownShow] = useState(false)
    const toggleDropdownShow = () => {
        setDropdownShow(!dropdownShow);
    }
    return (
        <div className="dropdown">  
            <div className="dropdown-toggle" id="account-dropdown-toggle" onClick={toggleDropdownShow}>
                {
                    user &&
                    <i className="fa fa-user-circle" />
                }
                {
                    !user &&
                   <button>Sign in</button>
                }
            </div>
            {
                user && dropdownShow &&
                <div>
                    <p className="text-2xl font-bold">{user && user.email && (<span>{user.email}</span>)}</p>
                    <a href="#about" className="header-link">Upgrade account</a>
                    <button onClick={ ()=>logOut()}>sign out<i className="fa fa-sign-out" /></button>
                </div>
            }
            {
                !user &&
                <div>
                    <button className="header-btn" onClick={() => loginWithGoogle()}>{/*handleLogin(signInWithGoogle) */}
                        <i className="fa fa-brands fa-google"></i>
                        Sign in with Google
                    </button>
                    <button className="header-btn" onClick={() => handleLogin(signInWithFacebook)}>
                        <i className="fa fa-brands fa-facebook"></i>
                        Sign in with Facebook
                    </button>
                </div>
            }
        </div>
    )
}

export default accountDropdown