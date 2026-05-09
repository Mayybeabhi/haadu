import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Toggle from '../components/ui/Toggle'
import { getGameState, setGameState } from '../store/gameStore'
import { createRoom } from '../api/roomApi'
import { updateRoomSettings } from '../api/roomApi'

export default function CreateRoomPage() {
  const navigate = useNavigate()
  const { user } = getGameState()

  const [maxPlayers, setMaxPlayers] = useState(8)
  const [songCount, setSongCount] = useState(5)
  const [isInBetweenRoundTimerEnabled, setisInBetweenRoundTimerEnabled] = useState(true)
  const [inBetweenRoundDuration, setinBetweenRoundDuration] = useState(10)
  const [isRoundTimerEnabled, setisRoundTimerEnabled] = useState(false)
  const [roundDuration, setroundDuration] = useState(30)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    setLoading(true)
    setError('')

    try {
        const roomCode=await createRoom()
        console.log(roomCode)
      const room = await updateRoomSettings(roomCode,{
        adminUserId: user.id,
        maxPlayers: Number(maxPlayers),
        songCount: Number(songCount),
        isInBetweenRoundTimerEnabled,
        inBetweenRoundDuration: Number(inBetweenRoundDuration),
        isRoundTimerEnabled,
        roundDuration: Number(roundDuration),
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

          <Field label="Between round timer">
            <div className="stack">
              <Toggle
                checked={isInBetweenRoundTimerEnabled}
                onChange={(e) => setisInBetweenRoundTimerEnabled(e.target.checked)}
                label="Enable break time"
              />
              {isInBetweenRoundTimerEnabled && (
                <Input
                  type="number"
                  min="0"
                  value={inBetweenRoundDuration}
                  onChange={(e) => setinBetweenRoundDuration(e.target.value)}
                  placeholder="Break time in seconds"
                />
              )}
            </div>
          </Field>

          <Field label="Round timer">
            <div className="stack">
              <Toggle
                checked={isRoundTimerEnabled}
                onChange={(e) => setisRoundTimerEnabled(e.target.checked)}
                label="Enable round timer"
              />
              {isRoundTimerEnabled && (
                <Input
                  type="number"
                  min="0"
                  value={roundDuration}
                  onChange={(e) => setroundDuration(e.target.value)}
                  placeholder="Round time in seconds"
                />
              )}
            </div>
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