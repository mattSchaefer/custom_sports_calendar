import { useState, useEffect, React } from 'react'
import '../App.css'
import { signInWithGoogle, signInWithFacebook, signInWithTwitter } from '../config/firebase/auth.js'
import { build_save_user_request } from '../factories/save_user_request_factory.js'
import { useAuth } from '../contexts/auth_context.jsx'
const Header = () => {
    const { user, loginWithGoogle, loginWithFacebook, loading, logOut } = useAuth();
    return (
        <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">{user && user.email && (<span>{user.email}</span>)}</h1>
        
       
            <ul className="flex space-x-4">
            <li><a href="/" className="hover:underline">About</a></li>
            <li><a href="/about" className="hover:underline">Leagues</a></li>
            <li><a href="/about" className="hover:underline">FAQ</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
            </ul>
            <div>
                <i className="fa fa-user-circle" />
            </div>
            <button onClick={ ()=>logOut()}>sign out<i className="fa fa-sign-out" /></button>
      
        </header>
    );
}
export default Header