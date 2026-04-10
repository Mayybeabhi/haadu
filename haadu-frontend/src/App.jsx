import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GuestNamePage from './pages/GuestNamePage'
import RoomChoicePage from './pages/RoomChoicePage'
import CreateRoomPage from './pages/CreateRoomPage'
import JoinRoomPage from './pages/JoinRoomPage'
import LobbyPage from './pages/LobbyPage'
import GamePage from './pages/GamePage'
import ResultsPage from './pages/ResultsPage'
export default function App(){
    return(
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/guest" element={<GuestNamePage/>}/>
            <Route path="/rooms" element={<RoomChoicePage/>}/>
            <Route path="/rooms/create" element={<CreateRoomPage />} />
            <Route path="/rooms/join" element={<JoinRoomPage />} />
            <Route path="/room/:roomCode" element={<LobbyPage />} />
            <Route path="/room/:roomCode/game" element={<GamePage />} />
            <Route path="/room/:roomCode/results" element={<ResultsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}