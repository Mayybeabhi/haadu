import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { connectToRoom } from '../ws/socket'

function Lobby() {
  const { roomCode } = useParams()
  const [events, setEvents] = useState([])

  useEffect(() => {
    connectToRoom(roomCode, (event) => {
      setEvents((prev) => [...prev, event])
    })
  }, [roomCode])

  return (
    <div>
      <h2>Room Code: {roomCode}</h2>

      <h3>Events</h3>
      <ul>
        {events.map((e, i) => (
          <li key={i}>{e.type}</li>
        ))}
      </ul>
    </div>
  )
}

export default Lobby
