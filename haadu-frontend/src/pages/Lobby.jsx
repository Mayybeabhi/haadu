import { useParams } from 'react-router-dom'

function Lobby() {
  const { roomCode } = useParams()

  return (
    <div>
      <h2>Room Code: {roomCode}</h2>
      <p>Waiting for players...</p>
    </div>
  )
}

export default Lobby
