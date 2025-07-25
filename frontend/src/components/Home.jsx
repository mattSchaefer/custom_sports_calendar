import { useState, useEffect, React } from 'react'
import '../App.css'
import P5Canvas from './P5Canvas.jsx'
import { build_save_user_request } from '../factories/save_user_request_factory.js'
import { useAuth } from '../contexts/auth_context.jsx'
import about_1 from '../assets/about_1.png'
import calendar_image from '../assets/calendar_month_example.png'
import cal_month_cropped from '../assets/cal_month_cropped.png'
import favorite_selector_1 from '../assets/favorite_selector_1.png'
function Home({}){
    const { user, loginWithGoogle, loginWithFacebook, loading, signOut, accessToken, favorites, setFavorites, sync_favorites } = useAuth();
    
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
    
    return(
        <div className="homepage-sections text-center">
            <div className="section" id="section-1">
                <span className="header-container on-top">
                    <span className="h1-container">
                        <h1 className="text-2xl font-bold main-header">SportSync<span className="inner-header">Schedule</span></h1>
                        <h1 className="sub-header">All your favorite sports, one unified calendar</h1>
                    </span>
                    <p className="header-paragraph"><span className="bold">SportSync</span> is your all-in-one solution for staying on top of the games that matter most to you.</p>
                    <span className="header-buttons">
                        <button id="get-started-btn" className="header-btn"><i className="fa fa-arrow-right" />Learn More</button>
                    </span>
                    <div className="p-4">
                    
                    {/* <button className="header-btn" onClick={() => handleLogin(signInWithTwitter)}>Sign in with X (Twitter)</button> */}
                    </div>
                </span>
                <P5Canvas />
            </div>
            <div className="section" id="about-us">
                
                <span className="about-verbiage">
                    <h1 id="about-header">Why SportSync?</h1>
                    <span className="about-para-and-img">
                        <span className="about-image-container">
                            <img src={favorite_selector_1} alt="About SportSync" className="about-image" />
                        </span>
                        <p className="about-paragraph">Tired of jumping between apps, websites, schedules, and google searches, just to keep track of your favorite teams? 
                        </p>
                    </span>
                    <span className="about-para-and-img">
                        <p className="about-paragraph">With SportSync, you can build a personalized sports calendar that combines games from multiple leagues and teams into one clean, unified view!</p>
                        <span className="about-image-container">
                            <img src={cal_month_cropped} alt="About SportSync" className="about-image" />
                        </span>
                    </span>
                </span>
                
            </div>
            <div className="section" id="what-we-offer">
                <h1>Key Features </h1>
                <div className="offerings-container">
                    <span className="offering-card">
                        <span className="offering-card-icon-container"><i className="fa fa-server"></i></span>
                        <h2 className="offering-card-header">Custom, Unified Calendar</h2>
                        <p>
                            Follow teams across leagues and see all upcoming games in one place.
                        </p>
                    </span>
                    <span className="offering-card">
                        <span className="offering-card-icon-container"><i className="fa fa-server"></i></span>
                        <h2 className="offering-card-header">Favorites Highlighted</h2>
                        <p>
                            Pin your favorite teams for quick visibility and enhanced styling.
                        </p>
                    </span>
                    <span className="offering-card">
                        <span className="offering-card-icon-container"><i className="fa fa-server"></i></span>
                        <h2 className="offering-card-header">Multi-League Support</h2>
                        <p>
                            Mix and match from different sports and leagues to build your perfect calendar.
                        </p>
                    </span>
                    <span className="offering-card">
                        <span className="offering-card-icon-container"><i className="fa fa-server"></i></span>
                        <h2 className="offering-card-header">Ad-Free + Game Reminders (Pro Only)</h2>
                        <p>
                           Upgrade to receive text or email reminders on game days — and enjoy an ad-free experience.
                        </p>
                    </span>
                    <span className="offering-card">
                        <span className="offering-card-icon-container"><i className="fa fa-server"></i></span>
                        <h2 className="offering-card-header">Quick and Easy</h2>
                        <p>
                           Sign in using Google or Facebook now!
                        </p>
                        <button>sign up</button>
                    </span>
                </div>
                <p className="center-para">Whether you're a casual fan or a die-hard supporter, <span className="bold-red">SportSync</span> helps you never miss a game, no matter how packed your sports world gets.</p>
                <hr />
                <div className="supported-leagues-container">
                    <div className="supported-leagues-header-para">
                        <h1>Supported Leagues</h1>
                        <p>We care about serving you the sports you care about.  If you're interested a league that's not listed here, please let us know!</p>
                    </div>
                    <div className="league-list-home">
                        <div className="league-card">

                        </div>
                        <div className="league-card">

                        </div>
                        <div className="league-card">

                        </div>
                        <div className="league-card">

                        </div>
                        <div className="league-card">

                        </div>
                    </div>
                </div>
            </div>
            <div className="section" id="about-us">
                <span className="about-verbiage">
                    <h1 id="about-header">Go Pro- coming soon!</h1>
                    <p className="about-paragraph">Configure your custom push notifications, whether it's only for your favorite teams or all games in your calendar.
                    </p>
                    <p className="about-paragraph">For only $5 per month, get notifications sent to your phone or email, and never look at an ad.</p>
                    <span>
                        <h3 className="about-header-small">Or, try for free!</h3>
                        <p className="about-paragraph about-small">Once you sign up and configure your calendar, you can use SportSync on the web to track your favorite teams and leagues for free.
                        </p>
                    </span>
                </span>
                <span className="about-image-container">
                    <img src={favorite_selector_1} alt="About SportSync" className="about-image" />
                </span>
            </div>
            
        </div>
    )
}
export default Home;