import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Search from './components/Search'
import AppRoutes from './routes/AppRoutes'
function App() {
  return(
    
    <>
      <Navbar/>
      <AppRoutes/>
    </>
    
  )
}

export default App
