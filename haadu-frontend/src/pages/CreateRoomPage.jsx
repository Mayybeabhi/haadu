import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import { getGameState, setGameState } from '../store/gameStore'
import { createRoom } from '../api/roomApi'
import { updateRoomSettings } from '../api/roomApi'

export default function CreateRoomPage() {
  const navigate = useNavigate()
  const { user } = getGameState()

  const [maxPlayers, setMaxPlayers] = useState(8)
  const [songCount, setSongCount] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    setLoading(true)
    setError('')

    try {
        const response=await createRoom()
        const roomCode=response.roomCode
        console.log(roomCode)
      const room = await updateRoomSettings(roomCode,{
        maxPlayers: Number(maxPlayers),
        songCount: Number(songCount),
        isInBetweenRoundTimerEnabled: false,
        inBetweenRoundDuration: 0 ,
        isRoundTimerEnabled: false,
        roundDuration: 0,
      })

      setGameState({ room: { roomCode }, isAdmin: true })
      navigate(`/room/${roomCode}`)
    } catch (e) {
      setError(e.response?.data?.message || 'Could not create room')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell">
      <div className="big-center-card stack animate-in">
        <div className="page-title">create room 🏗️</div>
        <div className="page-subtitle">
          set the chaos level before your friends join
        </div>

        <Card className="stack">
          <Field label="Max players">
            <Input
            type="number"
            min="2"
            max="20"
            value={maxPlayers}
            onChange={(e)=>setMaxPlayers(e.target.value)}/>
          </Field>

          <Field label="Song count">
            <Input
              type="number"
              min="1"
              max="20"
              value={songCount}
              onChange={(e) => setSongCount(e.target.value)}
            />
          </Field>

          <Button color="green" onClick={handleCreate} disabled={loading}>
            {loading ? 'creating room...' : 'generate room code'}
          </Button>

          {error && <div className="error-text">{error}</div>}
        </Card>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}