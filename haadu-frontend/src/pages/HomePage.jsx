
import { useNavigate } from 'react-router-dom'
import './HomePage.css'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <main className="home-page">
      {/* CRT scanlines */}
      <div className="home-crt-overlay" />

      <header className="home-nav">
        <a href="/" className="home-logo">
          HAADU<span>.</span>
        </a>

        <nav>
          <a href="#how-to-play">HOW TO PLAY</a>
          <a href="#about">ABOUT</a>
          <span className="home-equalizer">▮ ▮ ▮</span>
        </nav>
      </header>

      <section className="home-hero">
        <div className="home-hero-copy">
          <div className="home-eyebrow">
            <span>▶</span>
            A MULTIPLAYER MUSIC GUESSING GAME
          </div>

          <h1>
            WHO KNOWS
            <br />
            YOUR MUSIC BETTER?
            <br />
            <span>GUESS. PLAY. COMPETE.</span>
          </h1>

          <p>
            Bring your favourite songs. Challenge your friends.
            <br />
            Find out who really knows everyone's music taste.
          </p>

          <button
            className="home-play-button"
            onClick={() => navigate('/guest')}
          >
            <span>▶</span>
            PLAY NOW
          </button>
        </div>

        <div className="home-hero-art">
          <img
            src="/images/home-hero-collage.png"
            alt="Vintage music collage with a woman wearing headphones and a cassette"
            className="home-collage-image"
          />
        </div>
      </section>

      <footer className="home-bottom-strip">
        <span>♫ BRING YOUR SONGS</span>
        <span>■ GUESS THE SUBMITTER</span>
        <span>■ SCORE POINTS</span>
        <span>■ CROWN THE MUSIC EXPERT</span>
        <span>♫</span>
      </footer>
    </main>
  )
}
