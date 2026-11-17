
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import { getGameState, setGameState } from '../store/gameStore'
import { createRoom, updateRoomSettings } from '../api/roomApi'
import './CreateRoomPage.css'

export default function CreateRoomPage() {
  const navigate = useNavigate()
  const { user } = getGameState()

  const [maxPlayers, setMaxPlayers] = useState(8)
  const [songCount, setSongCount] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (loading) return

    setLoading(true)
    setError('')

    try {
      const response = await createRoom()
      const roomCode = response.roomCode

      await updateRoomSettings(roomCode, {
        maxPlayers: Number(maxPlayers),
        songCount: Number(songCount),
        isInBetweenRoundTimerEnabled: false,
        inBetweenRoundDuration: 0,
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
    <main className="create-room-page">
      <div className="create-room-grain" />
      <div className="create-room-scanlines" />

      <header className="create-room-nav">
        <a href="/" className="create-room-logo">
          HAADU<span>.</span>
        </a>

        <nav>
          <a href="/#how-to-play">HOW TO PLAY</a>
          <a href="/#about">ABOUT</a>
          <span className="create-room-equalizer">▮ ▮ ▮</span>
        </nav>
      </header>

      <section className="create-room-content">
        <div className="create-room-intro">
          <div className="create-room-eyebrow">
            FILE 03 / HOST SETTINGS
          </div>

          <h1>
            SET THE
            <br />
            <span>RULES.</span>
          </h1>

          <div className="create-room-underline" />

          <p>
            Every great game starts
            <br />
            with the right playlist.
          </p>

          <div className="create-room-note">
            <span>♫</span>
            YOU'RE THE HOST. MAKE IT COUNT.
          </div>
        </div>

        <div className="create-room-form-wrap">
          <Card className="create-room-card">
            <div className="create-room-card-header">
              <span>01 / GAME CONFIGURATION</span>
              <span className="create-room-music-icon">♫</span>
            </div>

            <h2>CREATE YOUR GAME</h2>

            <p className="create-room-card-description">
              Choose how many friends can join and how many songs
              everyone will bring.
            </p>

            <div className="create-room-fields">
              <div className="create-room-field">
                <label htmlFor="max-players">
                  MAX PLAYERS
                </label>

                <Input
                  id="max-players"
                  type="number"
                  min="2"
                  max="20"
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(e.target.value)}
                />

                <span className="create-room-hint">
                  MIN 2 / MAX 20 PLAYERS
                </span>
              </div>

              <div className="create-room-field">
                <label htmlFor="song-count">
                  SONGS PER PLAYER
                </label>

                <Input
                  id="song-count"
                  type="number"
                  min="1"
                  max="20"
                  value={songCount}
                  onChange={(e) => setSongCount(e.target.value)}
                />

                <span className="create-room-hint">
                  MIN 1 / MAX 20 SONGS
                </span>
              </div>
            </div>

            {error && (
              <div className="create-room-error">
                {error}
              </div>
            )}

            <Button
              color="green"
              className="create-room-submit"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? 'CREATING ROOM...' : 'GENERATE ROOM CODE →'}
            </Button>

            <div className="create-room-card-footer">
              <span>HOST CONTROLS</span>
              <span>READY WHEN YOU ARE ♫</span>
            </div>
          </Card>
        </div>
      </section>

      <footer className="create-room-bottom-strip">
        <span>♫ BRING YOUR SONGS</span>
        <span>■ GUESS THE SUBMITTER</span>
        <span>■ SCORE POINTS</span>
        <span>■ CROWN THE MUSIC EXPERT</span>
        <span>♫</span>
      </footer>
    </main>
  )
}
