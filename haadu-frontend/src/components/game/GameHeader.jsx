
export default function GameHeader({ roomCode, roundNumber, phase }) {
  return (
    <header className="arcade-header">
      <div className="arcade-brand">
        <a href="/" className="arcade-logo">HAADU<span>.</span></a>
        <div className="arcade-brand-divider" />
        <div className="arcade-context">
           THE GAME FLOOR
        </div>
      </div>

      <nav className="arcade-nav">
        <a href="/how-to-play">HOW TO PLAY</a>
        <a href="/about">ABOUT</a>
        <div className="arcade-menu">
          <i />
          <i />
          <i />
        </div>
      </nav>
    </header>
  )
}
