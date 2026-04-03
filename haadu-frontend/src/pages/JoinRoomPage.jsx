import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import { getGameState, setGameState } from '../store/gameStore'
import { joinRoom } from '../api/roomApi'

export default function JoinRoomPage() {
  const navigate = useNavigate()
  const { user } = getGameState()
  const [roomCode, setRoomCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleJoin = async () => {
    if (!roomCode.trim()) return

    setLoading(true)
    setError('')

    try {
      const room = await joinRoom(roomCode,user.id)

      setGameState({ room, isAdmin: false })
      navigate(`/room/${roomCode}`)
    } catch (e) {
      setError(e.response?.data?.message || 'Could not join room')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell center">
      <div className="big-center-card stack animate-in">
        <div className="page-title">join room 🚪</div>
        <div className="page-subtitle">
          paste the room code and enter the musical battlefield
        </div>

        <Card className="stack">
          <Input
            placeholder="Enter room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          />

          <Button color="yellow" onClick={handleJoin} disabled={loading}>
            {loading ? 'joining...' : 'join room'}
          </Button>

          {error && <div className="error-text">{error}</div>}
        </Card>
      </div>
    </div>
  )
}