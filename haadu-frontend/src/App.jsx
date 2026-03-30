import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import LobbyPage from './pages/LobbyPage'
import GamePage from './pages/GamePage'
import './App.css'

export default function App() {
  const [page, setPage] = useState('landing')
  const [user, setUser] = useState(null)
  const [room, setRoom] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const navigate = (p, data = {}) => {
    if (data.user) setUser(data.user)
    if (data.room) setRoom(data.room)
    if (data.isAdmin !== undefined) setIsAdmin(data.isAdmin)
    setPage(p)
  }

  return (
    <div className="app">
      {page === 'landing' && <LandingPage navigate={navigate} />}
      {page === 'lobby' && <LobbyPage navigate={navigate} user={user} room={room} isAdmin={isAdmin} setRoom={setRoom} />}
      {page === 'game' && <GamePage navigate={navigate} user={user} room={room} isAdmin={isAdmin} />}
    </div>
  )
}