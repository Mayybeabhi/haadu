import { useState } from 'react'
import axios from 'axios'
import './LandingPage.css'

const DOODLES = ['🎵', '🎶', '🎤', '🎸', '🥁', '🎹', '🎺', '🎻']

function FloatingDoodle({ emoji, style }) {
  return <div className="floating-doodle" style={style}>{emoji}</div>
}

export default function LandingPage({ navigate }) {
  const [step, setStep] = useState('home') // home | guest-name | join-or-create | create-settings | join-code
  const [guestName, setGuestName] = useState('')
  const [user, setUser] = useState(null)
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Room settings state
  const [maxPlayers, setMaxPlayers] = useState(4)
  const [songCount, setSongCount] = useState(3)
  const [roundTimerEnabled, setRoundTimerEnabled] = useState(false)
  const [roundDuration, setRoundDuration] = useState(60)
  const [inBetweenEnabled, setInBetweenEnabled] = useState(false)
  const [inBetweenDuration, setInBetweenDuration] = useState(15)

  const handleGuestSubmit = async () => {
    if (!guestName.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/api/users/guest', { username: guestName.trim() })
      setUser(res.data)
      setStep('join-or-create')
    } catch (e) {
      setError(e.response?.data?.message || 'That name is taken! Try another 😅')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRoom = async () => {
    setLoading(true)
    setError('')
    try {
      // Create room
      const createRes = await axios.post('/api/rooms', { adminUserId: user.id })
      const roomCode = createRes.data

      // Apply settings
      await axios.post(`/api/rooms/${roomCode}/settings`, {
        adminUserId: user.id,
        maxPlayers,
        songCount,
        isRoundTimerEnabled: roundTimerEnabled,
        roundDuration: roundTimerEnabled ? roundDuration : 0,
        isInBetweenRoundTimerEnabled: inBetweenEnabled,
        inBetweenRoundDuration: inBetweenEnabled ? inBetweenDuration : 0,
      })

      // Fetch room details
      const roomRes = await axios.get(`/api/rooms/${roomCode}`)
      navigate('lobby', { user, room: roomRes.data, isAdmin: true })
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create room 😢')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) return
    setLoading(true)
    setError('')
    try {
      await axios.post(`/api/rooms/${joinCode.toUpperCase()}/join`, { userId: user.id })
      const roomRes = await axios.get(`/api/rooms/${joinCode.toUpperCase()}`)
      navigate('lobby', { user, room: roomRes.data, isAdmin: false })
    } catch (e) {
      setError(e.response?.data?.message || 'Could not join room 😬')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="landing-page">
      {/* Floating doodles */}
      {DOODLES.map((d, i) => (
        <FloatingDoodle key={i} emoji={d} style={{
          top: `${10 + (i * 11) % 80}%`,
          left: `${5 + (i * 13) % 90}%`,
          animationDelay: `${i * 0.4}s`,
          fontSize: `${1.5 + (i % 3) * 0.5}rem`,
          opacity: 0.18 + (i % 3) * 0.06,
        }} />
      ))}

      {/* Title */}
      <div className="landing-header animate-bounce-in">
        <div className="title-wrap">
          <h1 className="doodle-title landing-title">haadu</h1>
          <div className="title-subtitle doodle-title">guess maadu! 🎵</div>
        </div>
        <p className="landing-desc">The multiplayer song guessing game where you try to fool your friends!</p>
      </div>

      {/* Steps */}
      <div className="landing-card-wrap">

        {step === 'home' && (
          <div className="card landing-card animate-bounce-in">
            <div className="doodle-title card-heading">how do you wanna play?</div>
            <div className="home-buttons">
              <button className="btn btn-yellow big-btn" onClick={() => setStep('guest-name')}>
                👤 Guest User
              </button>
              <button className="btn btn-blue big-btn" disabled title="Coming soon!">
                🔐 Login
              </button>
              <button className="btn btn-green big-btn" disabled title="Coming soon!">
                ✍️ Sign Up
              </button>
              <div className="doodle-note">login & signup coming soon!</div>
            </div>
          </div>
        )}

        {step === 'guest-name' && (
          <div className="card landing-card animate-bounce-in">
            <button className="back-btn" onClick={() => { setStep('home'); setError('') }}>← back</button>
            <div className="doodle-title card-heading">what should we call you?</div>
            <div className="input-row">
              <input
                className="input name-input"
                placeholder="your cool nickname..."
                value={guestName}
                maxLength={20}
                onChange={e => setGuestName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGuestSubmit()}
                autoFocus
              />
              <button className="btn btn-red" onClick={handleGuestSubmit} disabled={loading || !guestName.trim()}>
                {loading ? '...' : 'ok! 👍'}
              </button>
            </div>
            {error && <div className="error-msg">{error}</div>}
          </div>
        )}

        {step === 'join-or-create' && (
          <div className="card landing-card animate-bounce-in">
            <div className="welcome-tag">
              <span className="badge" style={{ background: '#f7c948', borderColor: '#2d2416' }}>
                👋 hey, {user?.username}!
              </span>
            </div>
            <div className="doodle-title card-heading">what do you wanna do?</div>
            <div className="home-buttons">
              <button className="btn btn-green big-btn" onClick={() => setStep('create-settings')}>
                🏠 Create Room
              </button>
              <button className="btn btn-blue big-btn" onClick={() => setStep('join-code')}>
                🚪 Join Room
              </button>
            </div>
          </div>
        )}

        {step === 'create-settings' && (
          <div className="card landing-card settings-card animate-bounce-in">
            <button className="back-btn" onClick={() => { setStep('join-or-create'); setError('') }}>← back</button>
            <div className="doodle-title card-heading">room settings 🎛️</div>

            <div className="settings-grid">
              <SettingRow label="👥 Max Players">
                <NumberPicker value={maxPlayers} min={2} max={10} onChange={setMaxPlayers} />
              </SettingRow>

              <SettingRow label="🎵 Songs per Player">
                <NumberPicker value={songCount} min={1} max={10} onChange={setSongCount} />
              </SettingRow>

              <SettingRow label="⏱️ Round Timer?">
                <label className="toggle">
                  <input type="checkbox" checked={roundTimerEnabled} onChange={e => setRoundTimerEnabled(e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
              </SettingRow>

              {roundTimerEnabled && (
                <SettingRow label="⏳ Round Duration (sec)">
                  <NumberPicker value={roundDuration} min={10} max={300} step={10} onChange={setRoundDuration} />
                </SettingRow>
              )}

              <SettingRow label="🔄 Between Round Timer?">
                <label className="toggle">
                  <input type="checkbox" checked={inBetweenEnabled} onChange={e => setInBetweenEnabled(e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
              </SettingRow>

              {inBetweenEnabled && (
                <SettingRow label="⌛ Break Duration (sec)">
                  <NumberPicker value={inBetweenDuration} min={5} max={60} step={5} onChange={setInBetweenDuration} />
                </SettingRow>
              )}
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button className="btn btn-pink big-btn generate-btn" onClick={handleCreateRoom} disabled={loading}>
              {loading ? 'creating...' : '✨ generate room code!'}
            </button>
          </div>
        )}

        {step === 'join-code' && (
          <div className="card landing-card animate-bounce-in">
            <button className="back-btn" onClick={() => { setStep('join-or-create'); setError('') }}>← back</button>
            <div className="doodle-title card-heading">enter room code 🔑</div>
            <div className="input-row">
              <input
                className="input code-input"
                placeholder="XXXXX"
                value={joinCode}
                maxLength={5}
                style={{ textTransform: 'uppercase', letterSpacing: '0.3em', textAlign: 'center', fontSize: '1.5rem' }}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleJoinRoom()}
                autoFocus
              />
            </div>
            <button className="btn btn-green big-btn" style={{ marginTop: 16 }} onClick={handleJoinRoom} disabled={loading || joinCode.length !== 5}>
              {loading ? 'joining...' : '🚀 join!'}
            </button>
            {error && <div className="error-msg">{error}</div>}
          </div>
        )}
      </div>
    </div>
  )
}

function SettingRow({ label, children }) {
  return (
    <div className="setting-row">
      <span className="setting-label doodle-title">{label}</span>
      <div className="setting-control">{children}</div>
    </div>
  )
}

function NumberPicker({ value, min, max, step = 1, onChange }) {
  return (
    <div className="number-picker">
      <button className="picker-btn" onClick={() => onChange(Math.max(min, value - step))}>−</button>
      <span className="picker-value doodle-title">{value}</span>
      <button className="picker-btn" onClick={() => onChange(Math.min(max, value + step))}>+</button>
    </div>
  )
}