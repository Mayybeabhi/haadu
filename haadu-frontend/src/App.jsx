import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GuestNamePage from './pages/GuestNamePage'
import CreateRoomPage from './pages/CreateRoomPage'
export default function App(){
    return(
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/guest" element={<GuestNamePage/>}/>
            <Route path="/rooms" element={<CreateRoomPage/>}/>
        </Routes>
    )
}