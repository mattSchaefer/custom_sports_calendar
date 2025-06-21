import { useState, useEffect, React } from 'react'
import './App.css'
import P5Canvas from './components/P5Canvas.jsx'
import { signInWithGoogle, signInWithFacebook, signInWithTwitter } from './config/firebase/auth.js'
import { build_save_user_request } from './factories/save_user_request_factory.js'
import { AuthProvider } from './contexts/auth_context.jsx'
import Home from './components/Home.jsx'
import Header from './components/Header.jsx'
import AppContainer from './components/AppContainer.jsx'
import Footer from './components/Footer.jsx'
function App() {
  //const { user, loginWithGoogle, loginWithFacebook, loading } = useAuth();
  const rq = {
        //url: "http://127.0.0.1:8000/api/get_eventsseason",
        url: "http://127.0.1:8000/api/get_league_teams",
        options: {
          method:"POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            leagueId: "4424",
            //year: "2025"
          })
        }
    }
    
    const handleLogin = async (method) => {
      try {
        const result = await method();
        const user = result.user;
        console.log("Signed in user:", user);
        console.log("saving user data...")
        const saveUserRequest = build_save_user_request(user);
        fetch(saveUserRequest.url, saveUserRequest.options)
          .then(response => response.json())
          .then(data => console.log("User data saved:", data))
          .catch(error => console.error("Error saving user data:", error));
        
      } catch (error) {
        console.error("OAuth Error:", error.message);
      }
  };
  useEffect(() => {
    // fetch(rq.url, rq.options)
    //   .then(response => response.json())
    //   .then(data => console.log(data))
    //   .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <AuthProvider>
      <Header />
      <AppContainer />
      <Footer />
    </AuthProvider>
  );
}

export default App;