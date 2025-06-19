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
            const result = await signInWithGoogle();
            setUser(result.user);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };
    const loginWithFacebook = async () => {
        try {
            const result = await signInWithFacebook();
            setUser(result.user);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Auth state changed:", currentUser);
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loginWithGoogle, loginWithFacebook, loading, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)