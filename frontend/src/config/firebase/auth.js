import { auth } from './firebase.js';
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signInWithTwitter = async () => {
  const provider = new TwitterAuthProvider();
  return signInWithPopup(auth, provider);
};

export const logOut = async () => {
  return signOut(auth)
    .then(() => {
      console.log("User signed out successfully.");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
}