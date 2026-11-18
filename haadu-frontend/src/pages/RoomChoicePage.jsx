
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getGameState } from '../store/gameStore'
import './RoomChoicePage.css'

export default function RoomChoicePage() {
  const navigate = useNavigate()
  const { user } = getGameState()

  useEffect(() => {
    if (!user) {
      navigate('/guest', { replace: true })
    }
  }, [user, navigate])

  if (!user) return null

  return (
    <main className="room-choice-page">
      <div className="room-choice-scanlines" />

      <header className="room-choice-nav">
        <a href="/" className="room-choice-logo">
          HAADU<span>.</span>
        </a>

        <nav>
          <span className="room-choice-user">
             {user.username}
          </span>
          <span className="room-choice-equalizer">▮ ▮ ▮</span>
        </nav>
      </header>

      <section className="room-choice-content">
        <div className="room-choice-heading">
          <div className="room-choice-eyebrow">
            FILE 02 / ROOM SELECTION
          </div>

          <h1>
            LET'S GET
            <br />
            <span>A ROOM.</span>
          </h1>

          <div className="room-choice-underline" />

          <p>
            The music is ready.
            <br />
            Choose how you want to play.
          </p>
        </div>

        <div className="room-choice-options">

          <button
            className="room-option create-option"
            onClick={() => navigate('/rooms/create')}
          >
            <div className="room-option-top">
              <span className="room-option-number">01 / HOST</span>
              
            </div>

            <div className="room-option-title">
              CREATE
              <br />
              ROOM
            </div>

            <p>
              Start a new game.
              <br />
              Set the rules and invite your friends.
            </p>

            <div className="room-option-action">
              <span>START A GAME</span>
              <span className="room-option-arrow">→</span>
            </div>
          </button>

          <button
            className="room-option join-option"
            onClick={() => navigate('/rooms/join')}
          >
            <div className="room-option-top">
              <span className="room-option-number">02 / PLAYER</span>
              
            </div>

            <div className="room-option-title">
              JOIN
              <br />
              ROOM
            </div>

            <p>
              Have a room code?
              <br />
              Jump straight into the game.
            </p>

            <div className="room-option-action">
              <span>ENTER ROOM</span>
              <span className="room-option-arrow">→</span>
            </div>
          </button>

        </div>
      </section>

      <footer className="room-choice-footer">
        <span>BRING YOUR SONGS</span>
        <span>GUESS THE SUBMITTER</span>
        <span>SCORE POINTS</span>
        <span>CROWN THE MUSIC EXPERT</span>
        
      </footer>
    </main>
  )
}
