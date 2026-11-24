
import { useNavigate } from 'react-router-dom'
import './HowToPlayPage.css'

const steps = [
  {
    number: '01',
    label: 'THE GATHERING',
    title: 'GET THE BAND TOGETHER.',
    description:
      'One of you creates a room. Share the room code and let your favourite people join the party.',
    note: 'ONE HOST. A WHOLE LOT OF OPINIONS.',
    icon: '♫',
  },
  {
    number: '02',
    label: 'THE MIXTAPE',
    title: 'DROP YOUR TRACKS.',
    description:
      'Everyone submits their YouTube song links. Pick tracks that say something about you. Keep your choices secret.',
    note: 'YOUR TASTE IS ABOUT TO BE EXPOSED.',
    icon: '▤',
  },
  {
    number: '03',
    label: 'THE LISTENING ROOM',
    title: 'LISTEN CLOSELY.',
    description:
      'A mystery song starts playing. Listen to the clues. Is it someone’s guilty pleasure? An old favourite?',
    note: 'EVERY SONG HAS A SUSPECT.',
    icon: '◉',
  },
  {
    number: '04',
    label: 'THE BIG GUESS',
    title: 'NAME THE CULPRIT.',
    description:
      'Choose the player you think submitted the song. Trust your instincts. Or blame the friend with questionable taste.',
    note: 'WHOSE SONG IS IT ANYWAY?',
    icon: '?',
  },
  {
    number: '05',
    label: 'THE REVEAL',
    title: 'REVEAL. SCORE. REPEAT.',
    description:
      'The host reveals the answer. Points are awarded, the leaderboard changes, and the next mystery begins.',
    note: 'ONLY ONE CAN WEAR THE CROWN.',
    icon: '♛',
  },
]

export default function HowToPlayPage() {
  const navigate = useNavigate()

  return (
    <main className="playbook-page">
      <div className="playbook-scanlines" />

      <header className="playbook-nav">
        <a href="/" className="playbook-logo">
          HAADU<span>.</span>
        </a>

        <button
          className="playbook-back"
          onClick={() => navigate('/')}
        >
          ← BACK TO HOME
        </button>
      </header>

      <section className="playbook-intro">
        <div className="playbook-eyebrow">
          <span>✳</span> THE OFFICIAL INSTRUCTION MANUAL
        </div>

        <h1>
          THE HAADU
          <br />
          <span>PLAYBOOK.</span>
        </h1>

        <p>
          Five steps. A bunch of songs.
          <br />
          And absolutely no idea who picked that track.
        </p>

        <div className="playbook-stamp">
          <span>READ BEFORE</span>
          <strong>YOU PLAY!</strong>
        </div>
      </section>

      <div className="playbook-warning">
        <span>⚠ YOU KNOW YOUR FRIENDS. OR DO YOU?</span>
        <span>EVERY SONG HAS A SUSPECT</span>
      </div>

      <section className="playbook-steps">
        {steps.map((step) => (
          <article className="playbook-step" key={step.number}>
            <div className="playbook-step-number">
              {step.number}
            </div>

            <div className="playbook-step-icon">
              {step.icon}
            </div>

            <div className="playbook-step-content">
              <div className="playbook-step-label">
                {step.label}
              </div>

              <h2>{step.title}</h2>

              <p>{step.description}</p>

              <div className="playbook-step-note">
                ✳ {step.note}
              </div>
            </div>

            <div className="playbook-step-decoration">
              HAADU
            </div>
          </article>
        ))}
      </section>

      <section className="playbook-finale">
        <div className="playbook-finale-eyebrow">
          THAT'S THE WHOLE RECORD.
        </div>

        <h2>
          NOW GO
          <br />
          <span>MAKE SOME NOISE.</span>
        </h2>

        <p>
          Bring your friends. Bring your songs.
          <br />
          Let's find out who really knows the group.
        </p>

        <button onClick={() => navigate('/guest')}>
          ▶ I GET IT. LET'S PLAY
        </button>

        <div className="playbook-footer-note">
          HAADU FM - BROADCASTING QUESTIONABLE MUSIC TASTE
        </div>
      </section>

      <footer className="playbook-footer">
        <span>♫ BRING YOUR SONGS</span>
        <span>■ GUESS THE SUBMITTER</span>
        <span>■ SCORE POINTS</span>
        <span>■ CROWN THE MUSIC EXPERT</span>
      </footer>
    </main>
  )
}
