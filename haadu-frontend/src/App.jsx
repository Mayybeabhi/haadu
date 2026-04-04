import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GuestNamePage from './pages/GuestNamePage'
import RoomChoicePage from './pages/RoomChoicePage'
import CreateRoomPage from './pages/CreateRoomPage'
import JoinRoomPage from './pages/JoinRoomPage'
import LobbyPage from './pages/LobbyPage'
export default function App(){
    return(
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/guest" element={<GuestNamePage/>}/>
            <Route path="/rooms" element={<RoomChoicePage/>}/>
            <Route path="/rooms/create" element={<CreateRoomPage />} />
            <Route path="/rooms/join" element={<JoinRoomPage />} />
            <Route path="/room/:roomCode" element={<LobbyPage />} />
        </Routes>
    )
}