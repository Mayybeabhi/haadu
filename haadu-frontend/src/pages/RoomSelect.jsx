import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRoom, joinRoom } from '../api/roomApi'

function RoomSelect() {
  const [roomCode, setRoomCode] = useState('')
  const navigate = useNavigate()

  const userId = localStorage.getItem('userId')

  const handleCreateRoom = async () => {
    const res = await createRoom(userId)
    navigate(`/rooms/${res.data.roomCode}`)
  }

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) return alert('Enter room code')

    await joinRoom(roomCode, userId)
    navigate(`/rooms/${roomCode}`)
  }

  return (
    <div>
      <h2>Create or Join Room</h2>

      <button onClick={handleCreateRoom}>
        Create Room
      </button>

      <hr />

      <input
        placeholder="Room code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
      />

      <button onClick={handleJoinRoom}>
        Join Room
      </button>
    </div>
  )
}

export default RoomSelect
