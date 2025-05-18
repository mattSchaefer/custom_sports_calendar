import { useState, useEffect, React } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import P5Canvas from './components/P5Canvas.jsx'

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/hello")
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="p-10 text-center">
      <div className="section" id="section-1">
        <span className="header-container on-top">
          <span className="h1-container">
            <h1 className="text-2xl font-bold main-header"> <i className="fa fa-thin fa-futbol"> </i>Sports Calendar Plus</h1>
            <h1 className="sub-header">One single calendar, all your favorit games</h1>
          </span>
          <p className="header-paragraph">Smartly integrate all your sports into one calendar.</p>
          <span className="header-buttons">
            <button className="header-btn">Learn More</button>
            <button id="get-started-btn" className="header-btn">Get Started</button>
          </span>
          
        </span>
        <P5Canvas />
      </div>
      <div className="section" id="section-2">
      </div>
    </div>
  );
}

export default App;