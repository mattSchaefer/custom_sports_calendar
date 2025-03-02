import { useState, useEffect, React } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/hello")
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">Django Ninja + React Boilerplate</h1>
      <p className="mt-4 text-lg">{message || "Loading..."}</p>
    </div>
  );
}

export default App;