import { useState, useEffect, React } from 'react'
import '../App.css'
import P5Canvas from './P5Canvas.jsx'
import { build_save_user_request } from '../factories/save_user_request_factory.js'
import { useAuth } from '../contexts/auth_context.jsx'
import about_1 from '../assets/about_1.png'
import calendar_image from '../assets/calendar_month_example.png'
import cal_month_cropped from '../assets/cal_month_cropped.png'
import favorite_selector_1 from '../assets/favorite_selector_1.png'
import favorite_selector_screenshot from '../assets/favorite_selector_screenshot.png'
import current_favorite_list from '../assets/current_favorite_list_screenshot.png'
import curr_fav_list_2 from '../assets/curr_fav_list_2.png'
import cal_4_day_1 from '../assets/cal_4_day_1.png'
import curr_favorites_3 from '../assets/current_favorites_3.png'
import calendar_month_3 from '../assets/calendar_month_3.png'
import team_selector_3 from '../assets/team_selector_3.png'

import epl_icon from '../assets/league_icons/epl_icon.png'
import bundesliga_icon from '../assets/league_icons/bundesliga_icon.png'
import seriea_icon from '../assets/league_icons/seriea_icon.png'
import ufc_icon from '../assets/league_icons/ufc_icon.png'
import nhl_icon from '../assets/league_icons/nhl_icon.png'
import nfl_icon from '../assets/league_icons/nfl_icon.png'
import nascar_icon from '../assets/league_icons/nascar_icon.png'
import mls_icon from '../assets/league_icons/mls_icon.png'
import mlb_icon from '../assets/league_icons/mlb_icon.png'
import leagues_cup_icon from '../assets/league_icons/leagues_cup_icon.png'
import fa_cup_icon from '../assets/league_icons/fa_cup_icon.png'
import europa_league_icon from '../assets/league_icons/europa_league_icon.png'
import champions_league_icon from '../assets/league_icons/champions_league_icon.png'
import carabao_cup_icon from '../assets/league_icons/carabao_cup_icon.png'
import laliga_icon from '../assets/league_icons/laliga_icon.png'
import world_cup_icon from '../assets/league_icons/world_cup_icon.png'
import f1_icon from '../assets/league_icons/f1_icon.png'
import nba_icon from '../assets/league_icons/nba_icon.png'
import ncaa_icon from '../assets/league_icons/ncaa-1.svg'

import logo from '../assets/sportsynclogov1.svg'
import useLeaguesAndTeamsHook from '../hooks/LeaguesAndTeamsHook.jsx'
function Home({}){
    const { user, loginWithGoogle, loginWithFacebook, loading, signOut, accessToken, favorites, setFavorites, sync_favorites } = useAuth();
    const [leagues] = useLeaguesAndTeamsHook(null, null)
    console.log(leagues)

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
        const cards = document.querySelectorAll(".offering-card, .league-card, .fade-in-on-scroll");
        console.log(cards)
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    }
                });
            },
            {
            threshold: 0.2,
            }
    );

    cards.forEach((card) => observer.observe(card));

    return () => {
        cards.forEach((card) => observer.unobserve(card));
    };
    }, [leagues]);
    return(
        <div className="homepage-sections text-center">
            <div className="section" id="section-1">
                <span className="header-container on-top" id="top">
                    <span className="h1-container">
                        {/* <h1 className="text-2xl font-bold main-header">SportSync<span className="inner-header">Schedule</span></h1>
                        <h1 className="sub-header">All your favorite sports, one unified calendar</h1> */}
                        <img src={logo} alt="SportSync Logo" className="logo-homepage fade-in-on-scroll" />
                        {/* <img src={cal_month_cropped} className="logo-homepage" id="home-background-op"/> */}
                    </span>
                    <h1 className="sub-header fade-in-on-scroll">All your favorite sports, one unified calendar</h1>
                    <p className="header-paragraph fade-in-on-scroll"><span className="bold">SportSync</span> is your one-stop-shop for staying on top of the games that matter most to you.</p>
                    {/* <span className="header-buttons fade-in-on-scroll">
                        <button id="get-started-btn" className="header-btn"><i className="fa fa-arrow-right" />Learn More</button>
                    </span> */}
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
                            <img src={team_selector_3} alt="About SportSync" className="about-image fade-in-on-scroll" />
                        </span>
                        <p className="about-paragraph fade-in-on-scroll">Tired of jumping between apps, websites, schedules, and google searches, just to keep track of your favorite teams? 
                        </p>
                    </span>
                    <span className="about-para-and-img">
                        <p className="about-paragraph fade-in-on-scroll">With SportSync, you can build a personalized sports calendar that combines games from multiple leagues and teams into one clean, unified view!</p>
                        <span className="about-image-container">
                            <img src={curr_favorites_3} alt="About SportSync" className="about-image fade-in-on-scroll" />
                            <img src={calendar_month_3} alt="About SportSync" className="about-image fade-in-on-scroll" />
                        </span>
                    </span>
                </span>
                
            </div>
            <div className="section" id="what-we-offer">
                <h1>Key Features </h1>
                <div className="offerings-container">
                    <span className="offering-card">
                        
                        <h2 className="offering-card-header">Plan Ahead with Ease</h2>
                        <i className="fa fa-calendar offering-card-icon default-offering-icon fade-in-on-scroll"></i>
                        <p>
                            Simple, easy to use calendar lets you see everything at once.
                        </p>
                    </span>
                    <span className="offering-card">
                        <h2 className="offering-card-header">Favorites Highlighted</h2>
                        
                        <i className="fa fa-star offering-card-icon favorite-team-highlight fade-in-on-scroll"></i>
                        <p>
                            Pin your favorite teams for quick visibility.
                        </p>
                    </span>
                    <span className="offering-card">
                        
                        <h2 className="offering-card-header">Multi-League Support</h2>
                        <span className="icon-row">
                            <i className="fa fa-futbol offering-card-icon fade-in-on-scroll"></i>
                            <i className="fa fa-football-ball offering-card-icon fade-in-on-scroll"></i>
                        </span>
                        <p>
                            Mix and match from different sports and leagues to build your perfect calendar.
                        </p>
                    </span>
                     <span className="offering-card">
                        
                        <h2 className="offering-card-header">Pro version coming soon!</h2>
                        <i className="fa fa-envelope offering-card-icon default-offering-icon fade-in-on-scroll"></i>
                        <p>
                           Soon you can receive daily notifications via text or email, and enjoy an ad-free experience.
                        </p>
                    </span> 
                    <span className="offering-card">
                        
                        <h2 className="offering-card-header">Quick and Easy</h2>
                          <i className="fa fa-check offering-card-icon default-offering-icon fade-in-on-scroll"></i>
                        <p>
                           Sign in using Google or Facebook now with one click!
                        </p>
                        <button>sign up</button>
                    </span>
                </div>
                <p className="center-para" id="leagues-home-anchor">Whether you're a casual fan or a die-hard supporter, <span className="bold-red">SportSync</span> helps you never miss a game, no matter how packed your sports world gets.</p>
                <hr />
                <div className="supported-leagues-container">
                    <div className="supported-leagues-header-para">
                        <h1>Supported Leagues</h1>
                        
                    </div>
                    <div className="league-list-home">
                        {/* <div className="league-card">

                        </div>
                        <div className="league-card">

                        </div>
                        <div className="league-card">

                        </div>
                        <div className="league-card">

                        </div>
                        <div className="league-card">

                        </div> */}
                        {
                            leagues.map((league) => {
                                return (<div className="league-card">
                                    <img src={
                                        league.name.toLowerCase() == "epl" ? epl_icon :
                                        league.name.toLowerCase() == "bundesliga" ? bundesliga_icon  : 
                                        league.name.toLowerCase() == "serie a" ? seriea_icon  : 
                                        league.name.toLowerCase() == "laliga" ? laliga_icon  : 
                                        league.name.toLowerCase() == "mls" ? mls_icon  : 
                                        league.name.toLowerCase() == "nfl" ? nfl_icon  : 
                                        league.name.toLowerCase() == "nhl" ? nhl_icon  : 
                                        league.name.toLowerCase() == "fifa world cup" ? world_cup_icon  : 
                                        league.name.toLowerCase() == "ufc" ? ufc_icon  : 
                                        league.name.toLowerCase() == "uefa champions league" ? champions_league_icon  : 
                                        league.name.toLowerCase() == "uefa europa league" ? europa_league_icon  : 
                                        league.name.toLowerCase() == "fa cup" ? fa_cup_icon  : 
                                        league.name.toLowerCase() == "efl carabao cup" ? carabao_cup_icon  :
                                        league.name.toLowerCase() == "mlb" ? mlb_icon  : 
                                        league.name.toLowerCase() == "nascar" ? nascar_icon  : 
                                        league.name.toLowerCase() == "f1" ? f1_icon  : 
                                        league.name.toLowerCase() == "nba" ? nba_icon  : 
                                        league.name.toLowerCase() == "leagues cup" ? leagues_cup_icon  :
                                        league.name.toLowerCase().indexOf("ncaa") <= 0 ? ncaa_icon  : ""
                                       
                                    } className="league-image" />
                                    <h3>{league.name}</h3>
                                </div>)
                            })
                        }
                    </div>
                </div>
            </div>
            {/* <div className="section" id="about-us">
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
            </div> */}
            
        </div>
    )
}
export default Home;