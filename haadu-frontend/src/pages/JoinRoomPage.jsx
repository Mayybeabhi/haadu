
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import { setGameState } from '../store/gameStore'
import { joinRoom } from '../api/roomApi'
import './JoinRoomPage.css'

export default function JoinRoomPage() {
  const navigate = useNavigate()

  const [roomCode, setRoomCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleJoin = async () => {
    if (!roomCode.trim() || loading) return

    setLoading(true)
    setError('')

    try {
      const room = await joinRoom(roomCode.trim().toUpperCase())

      setGameState({ room, isAdmin: false })
      navigate(`/room/${room.roomCode}`)
    } catch (e) {
      setError(e.response?.data?.message || 'Could not join room')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="join-room-page">
      <div className="join-room-grain" />
      <div className="join-room-scanlines" />

      <header className="join-room-nav">
        <a href="/" className="join-room-logo">
          HAADU<span>.</span>
        </a>

        <nav>
          <a href="/#how-to-play">HOW TO PLAY</a>
          <a href="/#about">ABOUT</a>
          <span className="join-room-equalizer">▮ ▮ ▮</span>
        </nav>
      </header>

      <section className="join-room-content">
        <div className="join-room-intro">
          <div className="join-room-eyebrow">
            FILE 04 / PLAYER ENTRY
          </div>

          <h1>
            GOT A
            <br />
            <span>ROOM CODE?</span>
          </h1>

          <div className="join-room-underline" />

          <p>
            Your friends are waiting.
            <br />
            Enter the code and join the game.
          </p>

          <div className="join-room-note">
            
            THE MUSIC IS BETTER TOGETHER.
          </div>
        </div>

        <div className="join-room-form-wrap">
          <Card className="join-room-card">
            <div className="join-room-card-header">
              <span>02 / PLAYER ACCESS</span>
              
            </div>

            <h2>JOIN THE ROOM</h2>

            <p className="join-room-card-description">
              Got an invite? Enter the room code shared by your host
              to jump straight into the game.
            </p>

            <form
              className="join-room-form"
              onSubmit={(e) => {
                e.preventDefault()
                handleJoin()
              }}
            >
              <label htmlFor="room-code">
                ROOM CODE
              </label>

              <Input
                id="room-code"
                placeholder="ENTER ROOM CODE..."
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                autoComplete="off"
                autoFocus
              />

              <span className="join-room-hint">
                ASK YOUR HOST FOR THE ROOM CODE
              </span>

              {error && (
                <div className="join-room-error">
                  {error}
                </div>
              )}

              <Button
                color="yellow"
                type="submit"
                className="join-room-submit"
                disabled={loading || !roomCode.trim()}
              >
                {loading ? 'JOINING ROOM...' : 'ENTER ROOM →'}
              </Button>
            </form>

            <div className="join-room-card-footer">
              <span>PLAYER ACCESS</span>
              
            </div>
          </Card>
        </div>
      </section>

      <footer className="join-room-bottom-strip">
        <span>BRING YOUR SONGS</span>
        <span>GUESS THE SUBMITTER</span>
        <span>SCORE POINTS</span>
        <span>CROWN THE MUSIC EXPERT</span>
        
      </footer>
    </main>
  )
}
