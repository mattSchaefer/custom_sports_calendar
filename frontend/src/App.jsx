import { useState, useEffect, React } from 'react'
import './App.css'
import P5Canvas from './components/P5Canvas.jsx'
import { signInWithGoogle, signInWithFacebook, signInWithTwitter } from './config/firebase/auth.js'
import { build_save_user_request } from './factories/save_user_request_factory.js'
function App() {

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
    <div className="p-10 text-center">
      <div className="section" id="section-1">
        <span className="header-container on-top">
          <span className="h1-container">
            <h1 className="text-2xl font-bold main-header"> {/*<i className="fa fa-thin fa-futbol"> </i>*/}Sports Calendar Plus</h1>
            <h1 className="sub-header">One single calendar, all your favorit games</h1>
          </span>
          <p className="header-paragraph">Smartly integrate all your sports into one calendar.</p>
          <span className="header-buttons">
            <button className="header-btn">Learn More</button>
            <button id="get-started-btn" className="header-btn">Get Started</button>
          </span>
           <div className="p-4">
            <button className="header-btn" onClick={() => handleLogin(signInWithGoogle)}>
              <i className="fa fa-brands fa-google"></i>
              Sign in with Google
            </button>
            <button className="header-btn" onClick={() => handleLogin(signInWithFacebook)}>
              <i className="fa fa-brands fa-facebook"></i>
              Sign in with Facebook
            </button>
            {/* <button className="header-btn" onClick={() => handleLogin(signInWithTwitter)}>Sign in with X (Twitter)</button> */}
          </div>
        </span>
        <P5Canvas />
      </div>
      <div className="section" id="section-2"></div>
    </div>
  );
}

export default App;