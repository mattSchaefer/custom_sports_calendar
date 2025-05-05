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
      <span className="header-container on-top">
        <h1 className="text-2xl font-bold main-header">Sports Calendar Plus</h1>
        <p className="mt-4 text-lg">All your favorite sports, all in one place</p>
      </span>
      <P5Canvas />
    </div>
  );
}

export default App;