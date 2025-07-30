import {signInWithGoogle, signInWithFacebook, logOut} from '../config/firebase/auth.js';
import { build_save_user_request } from '../factories/save_user_request_factory.js'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { createContext, useContext, useState, React, useEffect, useMemo } from 'react';
import { auth } from '../config/firebase/firebase.js';
import { useUserFavoritesHook } from '../hooks/UserFavoritesHook.jsx';

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [accessToken, setAccessToken] = useState(null)
    const [favorites, setFavorites, sync_favorites, games, setGames, cfbRankings, setCfbRankings] = useUserFavoritesHook(user, accessToken);
    const loginWithGoogle = async () => {
        try {
            const result = await signInWithGoogle()
            console.log(result)
            //setUser(() => result.user)
        } catch (error) {
            console.error("Login failed:", error)
        }
    };
    const loginWithFacebook = async () => {
        try {
            const result = await signInWithFacebook()
            //console.log(getDbUser(result.user))
            //setUser(() => result.user);
            console.log(result)
        } catch (error) {
            console.error("Login failed:", error)
        }
    };
    const getDbUser = async(user) => {   
        try{  
            return await fetch("http://127.0.1:8000/api/get_user_data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.accessToken}`
                },
                body: JSON.stringify({
                    uid: user.uid
                })
            }).then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }
                return response.json();
            }).then(data => {
                console.log("User data fetched:", data)
                return data
            }).catch(error => {
                console.error("Error fetching user data:", error)
            });
        }catch(e){
            console.error("Error in getDbUser:", e)
        }
    }
    useEffect(() => {
        try{
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                if(!currentUser || !currentUser.accessToken){
                    setUser(() => null)
                    throw "not signed in"
                }
                setAccessToken(() => currentUser.accessToken)
                //sync with db and retrieve other user attrs
                const saveUserRequest = build_save_user_request(currentUser)
                console.log(saveUserRequest)
                fetch(saveUserRequest.url, saveUserRequest.options)
                    .then(response => {
                        if(response.status == 200) 
                            return response.json()
                        else
                            throw("not valid")
                    })
                    .then(data => {
                        console.log("User data saved:", data)
                        setUser(() => data)
                    
                    })
                    .catch(error => console.error("Error saving user data:", error));
                setLoading(() => false);
            });
            return () => unsubscribe();
        }catch(e){return console.error("Error in useEffect:", e)}
    }, []);
    useEffect(() => {
        if(user){
            console.log(user.followed_teams)
            setFavorites(() => 
                
                 {
                    return {
                        favorite_teams: user.favorite_teams,
                        followed_teams: user.followed_teams,
                        followed_leagues: user.followed_leagues,
                        on_load: true
                    }
                }
            );
        }
    }, [user])
    const authContextValue = useMemo(() => ({
        user,
        loginWithGoogle,
        loginWithFacebook,
        loading,
        logOut,
        accessToken,
        favorites, 
        setFavorites, 
        sync_favorites,
        games,
        setGames, cfbRankings, setCfbRankings
    }), [user, loginWithGoogle, loginWithFacebook, loading, logOut, accessToken, favorites, setFavorites, sync_favorites, games, setGames, cfbRankings, setCfbRankings]);
    return (
        <AuthContext.Provider value={authContextValue}> {/*</AuthContext.Provider><AuthContext.Provider value={{ user, loginWithGoogle, loginWithFacebook, loading, logOut, accessToken }}>*/}
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)