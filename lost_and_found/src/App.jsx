import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LostAndFoundPage from './Components/lost_and_found'
function App() {
  const [count, setCount] = useState(0)

  return (
    <LostAndFoundPage />
  )
}

export default App
