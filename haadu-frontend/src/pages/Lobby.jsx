import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { connectToRoom } from '../ws/socket'
import { getRoomPlayers } from '../api/roomApi'

function Lobby() {

  const { roomCode } = useParams()
  const [players, setPlayers] = useState([])

  const loadPlayers = async () => {
    const res = await getRoomPlayers(roomCode)
    setPlayers(res.data)
  }

  useEffect(() => {

    loadPlayers()

    const stomp = connectToRoom(roomCode, (event) => {
      if(event.type === "PLAYER_JOINED"){
        loadPlayers()
      }
    })

    return () => {
      if (stomp && stomp.connected) {
          stomp.disconnect()
        }
    }

  }, [])

  return (
    <div>

      <h2>Room Code: {roomCode}</h2>

      <h3>Players</h3>

      <ul>
        {players.map(p => (
          <li key={p.userId}>
            {p.username} {p.isAdmin && "(Admin)"}
          </li>
        ))}
      </ul>

    </div>
  )
}

export default Lobby