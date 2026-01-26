import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createGuestUser } from '../api/roomApi'

function Home() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const handleCreateRoom=async()=>{

    const userRes=await createGuestUser(username)
    const userId=userRes.data.id

    const roomRes=await createRoom(userId)
    const roomCode=roomRes.data.roomCode

    navigate('/rooms/${roomCode}',{state:{userId}})


  }

  return (
    <div>
      <h1>🎵 Haadu</h1>

      <input
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  )
}

export default Home
