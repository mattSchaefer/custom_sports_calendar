import {signInWithGoogle, signInWithFacebook, logOut} from '../config/firebase/auth.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { createContext, useContext, useState, React, useEffect } from 'react';
import { auth } from '../config/firebase/firebase.js';
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)
    const loginWithGoogle = async () => {
        try {
            const result = await signInWithGoogle()
            //console.log()
            setUser(result.user)
        } catch (error) {
            console.error("Login failed:", error)
        }
    };
    const loginWithFacebook = async () => {
        try {
            const result = await signInWithFacebook()
            console.log(getDbUser(result.user))
            setUser(result.user);
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
            var user_obj = {...currentUser}
            getDbUser(currentUser)
            .then((db_user2) => {
                if(db_user2.phone){
                    user_obj.phone = db_user2.phone
                }
                setUser(user_obj)
            });
            setLoading(false);
        });
        return () => unsubscribe();
        }catch(e){return console.error("Error in useEffect:", e)}
    }, []);

    return (
        <AuthContext.Provider value={{ user, loginWithGoogle, loginWithFacebook, loading, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)