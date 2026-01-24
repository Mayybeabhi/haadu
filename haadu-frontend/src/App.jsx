import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Lobby from './pages/Lobby'
import Game from './pages/Game'
import Scores from './pages/Scores'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms/:roomCode" element={<Lobby />} />
        <Route path="/game/:roomCode" element={<Game />} />
        <Route path="/scores/:roomCode" element={<Scores />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
