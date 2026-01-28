import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Username from './pages/Username'
import RoomSelect from './pages/RoomSelect'
import Lobby from './pages/Lobby'
import Game from './pages/Game'
import Scores from './pages/Scores'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Username />} />
        <Route path="/room-select" element={<RoomSelect />} />
        <Route path="/rooms/:roomCode" element={<Lobby />} />
        <Route path="/game/:roomCode" element={<Game />} />
        <Route path="/scores/:roomCode" element={<Scores />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
