
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { createGuestUser } from '../api/userApi'
import { setGameState } from '../store/gameStore'
import './GuestNamePage.css'

export default function GuestNamePage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleContinue = async () => {
    if (!name.trim() || loading) return

    setLoading(true)
    setError('')

    try {
      const user = await createGuestUser(name.trim())

      setGameState({
        user: {
          id: user.id,
          username: user.username,
        },
        token: user.token,
        isAdmin: false,
        room: null,
        players: [],
      })

      navigate('/rooms')
    } catch (e) {
      setError(e.response?.data?.message || 'Could not create guest user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="guest-page">
      <div className="crt-overlay" />

      <header className="haadu-nav">
        <a href="/" className="haadu-logo">
          HAADU<span>.</span>
        </a>

        <nav>
          <a href="/how-to-play">HOW TO PLAY</a>
          <span className="nav-equalizer">▮ ▮ ▮</span>
        </nav>
      </header>

      <section className="guest-content">

        <div className="guest-artwork">
          <img
            src="/images/guest-vinyl-collage.png"
            alt="Vintage vinyl records and music collage"
            className="guest-vinyl-image"
          />
        </div>

        <div className="guest-form-panel">
          <div className="guest-eyebrow">
            FILE 01 / ENTER
          </div>

          <h1>
            WHAT SHOULD
            <br />
            WE CALL YOU?
          </h1>

          <div className="title-underline" />

          <p className="guest-description">
            Every great playlist has a name.
            <br />
            What should your friends call you?
          </p>

          <form
            className="guest-form"
            onSubmit={(e) => {
              e.preventDefault()
              handleContinue()
            }}
          >
            <Input
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={24}
              autoComplete="off"
              autoFocus
            />

            {error && (
              <div className="guest-error">
                {error}
              </div>
            )}

            <Button
              color="yellow"
              type="submit"
              disabled={loading || !name.trim()}
            >
              {loading ? 'ENTERING...' : 'CONTINUE →'}
            </Button>
          </form>

          <div className="guest-footnote">
            NO ACCOUNT. NO PASSWORD. JUST MUSIC.
          </div>
        </div>

        <div className="guest-headphones">
          <img
            src="/images/guest-headphones.png"
            alt="Vintage headphones illustration"
            className="guest-headphones-image"
          />
        </div>

      </section>

      <div className="guest-bottom-line">
        <span>BRING YOUR SONGS</span>
        <span>GUESS THE SUBMITTER</span>
        <span>SCORE POINTS</span>
        <span>CROWN THE MUSIC EXPERT</span>
        
      </div>
    </main>
  )
}
