import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import './GamePage.css'

const COLORS = ['#f7c948', '#4caf82', '#3d7fe8', '#e8453c', '#9b59b6', '#f39c12', '#e91e8c', '#1abc9c']

export default function GamePage({ navigate, user, room, isAdmin }) {
  const [phase, setPhase] = useState('waiting') // waiting | playing | revealed | finished
  const [players, setPlayers] = useState([])
  const [currentRound, setCurrentRound] = useState(null)
  const [currentSongUrl, setCurrentSongUrl] = useState('')
  const [myGuess, setMyGuess] = useState(null) // userId guessed
  const [allGuesses, setAllGuesses] = useState([]) // {guessingUserId, guessedUserId}
  const [revealedOwner, setRevealedOwner] = useState(null)
  const [scores, setScores] = useState({})
  const [scoringMode, setScoringMode] = useState('GUESSER')
  const [showScores, setShowScores] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [roundNumber, setRoundNumber] = useState(0)
  const [winner, setWinner] = useState(null)
  const stompRef = useRef(null)

  const fetchPlayers = async () => {
    try {
      const res = await axios.get(`/api/rooms/${room.roomCode}/players`)
      setPlayers(res.data)
      return res.data
    } catch { return [] }
  }

  const fetchScores = async (mode) => {
    try {
      const res = await axios.get(`/api/rooms/${room.roomCode}/scores?mode=${mode || scoringMode}`)
      setScores(res.data)
    } catch {}
  }

  useEffect(() => {
    fetchPlayers()

    const sock = new SockJS('/ws')
    const stomp = new Client({
      webSocketFactory: () => sock,
      onConnect: () => {
        stomp.subscribe(`/topic/rooms/${room.roomCode}`, async (msg) => {
          const event = JSON.parse(msg.body)

          if (event.type === 'ROUND_STARTED') {
            const { roundNumber: rn, songId } = event.payload
            setRoundNumber(rn)
            setPhase('playing')
            setMyGuess(null)
            setAllGuesses([])
            setRevealedOwner(null)
            setCurrentRound({ id: event.payload.roundId, roundNumber: rn, songId })
            // Fetch song URL from submission
            try {
              const songRes = await axios.get(`/api/rooms/${room.roomCode}/songs/${songId}`)
              setCurrentSongUrl(songRes.data?.youtubeUrl || '')
            } catch {
              setCurrentSongUrl('')
            }
          }

          if (event.type === 'GUESS_SUBMITTED') {
            // Refresh guess counts
            setAllGuesses(prev => [...prev, { guessingUserId: event.payload.userId }])
          }

          if (event.type === 'ROUND_CLOSED') {
            setRevealedOwner(event.payload.correctUserId)
            setPhase('revealed')
            fetchScores()
          }

          if (event.type === 'GAME_FINISHED') {
            setPhase('finished')
            fetchScores()
          }
        })
      },
    })
    stomp.activate()
    stompRef.current = stomp

    return () => stomp.deactivate()
  }, [])

  const handleStartRound = async () => {
    setLoading(true)
    setError('')
    try {
      await axios.post(`/api/rooms/${room.roomCode}/rounds/start`, { adminUserId: user.id })
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to start round')
    } finally {
      setLoading(false)
    }
  }

  const handleGuess = async (guessedUserId) => {
    if (myGuess) return
    setLoading(true)
    try {
      await axios.post(`/api/rooms/${room.roomCode}/rounds/${currentRound.id}/guess`, {
        guessingUserId: user.id,
        guessedUserId,
      })
      setMyGuess(guessedUserId)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to submit guess')
    } finally {
      setLoading(false)
    }
  }

  const handleEndRound = async () => {
    setLoading(true)
    setError('')
    try {
      await axios.post(`/api/rooms/${room.roomCode}/rounds/${currentRound.id}/end`, { adminUserId: user.id })
    } catch (e) {
      setError(e.response?.data?.message || 'Cannot end round yet!')
    } finally {
      setLoading(false)
    }
  }

  const handleEndGame = async () => {
    setLoading(true)
    setError('')
    try {
      await axios.post(`/api/rooms/${room.roomCode}/end`, { adminUserId: user.id })
      setPhase('finished')
      fetchScores()
    } catch (e) {
      setError(e.response?.data?.message || 'Cannot end game yet!')
    } finally {
      setLoading(false)
    }
  }

  const handleScoringModeChange = async (mode) => {
    setScoringMode(mode)
    await fetchScores(mode)
  }

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null
    try {
      const u = new URL(url)
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}?autoplay=1`
      if (u.hostname === 'youtu.be') return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1`
    } catch {}
    return null
  }

  const embedUrl = getYoutubeEmbedUrl(currentSongUrl)
  const sortedScores = Object.entries(scores)
    .map(([uid, s]) => ({ uid, score: s, player: players.find(p => p.userId === uid) }))
    .sort((a, b) => b.score - a.score)

  const topScore = sortedScores[0]?.score
  const winners = sortedScores.filter(s => s.score === topScore)

  return (
    <div className="game-page">
      {/* Header */}
      <div className="game-header">
        <div className="doodle-title game-title">haadu 🎵</div>
        <div className="header-actions">
          <button
            className="btn btn-white score-toggle-btn"
            onClick={() => {
              setShowScores(!showScores)
              if (!showScores) fetchScores()
            }}
          >
            📊 {showScores ? 'hide scores' : 'scores'}
          </button>
          <span className="badge" style={{ background: '#fff3e0' }}>
            🏠 {room.roomCode}
          </span>
        </div>
      </div>

      {/* Scores panel */}
      {showScores && (
        <div className="card scores-panel animate-bounce-in">
          <div className="scores-header">
            <span className="doodle-title panel-title-sm">📊 scores</span>
            <div className="mode-toggle">
              <span className="doodle-title mode-label">scoring:</span>
              <button
                className={`mode-btn ${scoringMode === 'GUESSER' ? 'active' : ''}`}
                onClick={() => handleScoringModeChange('GUESSER')}
              >🔍 guesser</button>
              <button
                className={`mode-btn ${scoringMode === 'OWNER' ? 'active' : ''}`}
                onClick={() => handleScoringModeChange('OWNER')}
              >🎵 owner</button>
            </div>
          </div>
          <div className="scores-list">
            {sortedScores.map((s, i) => (
              <div key={s.uid} className="score-row" style={{ background: i === 0 && s.score > 0 ? '#fffde7' : 'white' }}>
                <span className="rank doodle-title">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                <div className="score-avatar" style={{ background: COLORS[i % COLORS.length] }}>
                  {(s.player?.username || '?')[0].toUpperCase()}
                </div>
                <span className="score-name doodle-title">{s.player?.username || s.uid.slice(0, 8)}</span>
                {s.uid === user?.id && <span className="badge you-badge-sm">you!</span>}
                <span className="score-val doodle-title">{s.score} pts</span>
              </div>
            ))}
            {sortedScores.length === 0 && (
              <div className="no-scores doodle-title">no scores yet!</div>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="game-body">

        {/* WAITING for round */}
        {phase === 'waiting' && (
          <div className="card phase-card animate-bounce-in">
            <div className="doodle-title phase-heading">🎮 game started!</div>
            <p className="phase-desc">get ready — admin will start the first round soon!</p>
            {isAdmin && (
              <button className="btn btn-green big-action-btn" onClick={handleStartRound} disabled={loading}>
                {loading ? 'starting...' : '▶️ start round 1!'}
              </button>
            )}
            {!isAdmin && (
              <div className="doodle-title waiting-for">⏳ waiting for admin...</div>
            )}
          </div>
        )}

        {/* PLAYING */}
        {phase === 'playing' && (
          <div className="playing-layout">
            <div className="round-badge-wrap">
              <div className="round-badge doodle-title">🎵 round {roundNumber}</div>
            </div>

            {/* YouTube embed */}
            <div className="card video-card">
              <div className="doodle-title video-label">whose song is this? 🤔</div>
              {embedUrl ? (
                <div className="video-wrap">
                  <iframe
                    src={embedUrl}
                    title="Song"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowFullScreen
                    className="video-iframe"
                  />
                </div>
              ) : (
                <div className="no-video doodle-title">🎵 song playing... (no video available)</div>
              )}
            </div>

            {/* Guess section */}
            <div className="card guess-card">
              <div className="doodle-title guess-heading">
                {myGuess ? '✅ guess submitted!' : '👇 who submitted this song?'}
              </div>

              {!myGuess && (
                <div className="guess-grid">
                  {players
                    .filter(p => p.userId !== user?.id)
                    .map((p, i) => (
                      <button
                        key={p.userId}
                        className="guess-btn doodle-title"
                        style={{ background: COLORS[i % COLORS.length] }}
                        onClick={() => handleGuess(p.userId)}
                        disabled={loading}
                      >
                        {p.username}
                      </button>
                    ))}
                </div>
              )}

              {myGuess && (
                <div className="my-guess-display">
                  <div className="doodle-title guess-reveal-text">you guessed:</div>
                  <div className="guess-chip doodle-title" style={{
                    background: COLORS[players.findIndex(p => p.userId === myGuess) % COLORS.length] || '#f7c948'
                  }}>
                    {players.find(p => p.userId === myGuess)?.username || '?'}
                  </div>
                  <div className="guess-count doodle-title">
                    {allGuesses.length}/{players.length} guessed
                  </div>
                </div>
              )}

              {/* Others' guesses */}
              {allGuesses.length > 0 && (
                <div className="guesses-tracker">
                  {players.map(p => {
                    const hasGuessed = allGuesses.some(g => g.guessingUserId === p.userId) || p.userId === user?.id && myGuess
                    return (
                      <div key={p.userId} className={`guess-indicator ${hasGuessed ? 'guessed' : 'waiting'}`}>
                        <span className="doodle-title">{p.username[0]}</span>
                        <span className="guess-status">{hasGuessed ? '✅' : '⌛'}</span>
                      </div>
                    )
                  })}
                </div>
              )}

              {isAdmin && (
                <div className="admin-actions">
                  <button className="btn btn-red" onClick={handleEndRound} disabled={loading}>
                    {loading ? '...' : '🔔 reveal answer!'}
                  </button>
                  <div className="admin-hint doodle-title">everyone must guess before reveal</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* REVEALED */}
        {phase === 'revealed' && (
          <div className="card phase-card animate-bounce-in revealed-card">
            <div className="doodle-title phase-heading">🎉 the answer is...</div>

            <div className="reveal-player">
              {(() => {
                const p = players.find(pl => pl.userId === revealedOwner)
                const idx = players.findIndex(pl => pl.userId === revealedOwner)
                const correct = myGuess === revealedOwner
                return (
                  <>
                    <div className="reveal-avatar" style={{ background: COLORS[idx % COLORS.length] }}>
                      {(p?.username || '?')[0].toUpperCase()}
                    </div>
                    <div className="doodle-title reveal-name">{p?.username || 'unknown'}</div>
                    <div className={`result-badge doodle-title ${correct ? 'correct' : 'wrong'}`}>
                      {correct ? '🎯 you got it right!' : '😅 you got it wrong!'}
                    </div>
                  </>
                )
              })()}
            </div>

            {/* Show who guessed what */}
            <div className="guess-breakdown">
              <div className="doodle-title breakdown-title">everyone guessed:</div>
              {allGuesses.map((g, i) => {
                const guesser = players.find(p => p.userId === g.guessingUserId)
                const guessedPlayer = players.find(p => p.userId === g.guessedUserId)
                const correct = g.guessedUserId === revealedOwner
                return (
                  <div key={i} className={`breakdown-row ${correct ? 'correct-row' : 'wrong-row'}`}>
                    <span className="doodle-title">{guesser?.username || '?'}</span>
                    <span className="arrow">→</span>
                    <span className="doodle-title">{guessedPlayer?.username || '?'}</span>
                    <span>{correct ? '✅' : '❌'}</span>
                  </div>
                )
              })}
            </div>

            {isAdmin && (
              <div className="admin-actions">
                <button className="btn btn-green big-action-btn" onClick={handleStartRound} disabled={loading}>
                  {loading ? '...' : '▶️ next round!'}
                </button>
                <button className="btn btn-red" onClick={handleEndGame} disabled={loading}>
                  {loading ? '...' : '🏁 end game'}
                </button>
              </div>
            )}
            {!isAdmin && <div className="doodle-title waiting-for">⏳ waiting for next round...</div>}
          </div>
        )}

        {/* FINISHED */}
        {phase === 'finished' && (
          <div className="card phase-card finished-card animate-bounce-in">
            <div className="doodle-title phase-heading">🏆 game over!</div>

            <div className="winner-section">
              <div className="doodle-title winner-label">
                {scoringMode === 'GUESSER' ? '🔍 guesser mode' : '🎵 owner mode'} winner{winners.length > 1 ? 's' : ''}!
              </div>
              {winners.map((w, i) => (
                <div key={w.uid} className="winner-chip doodle-title animate-wiggle">
                  🥇 {w.player?.username || w.uid.slice(0, 8)} — {w.score} pts
                </div>
              ))}
            </div>

            {/* Mode toggle for final */}
            <div className="final-mode-toggle">
              <span className="doodle-title">switch scoring:</span>
              <div className="mode-toggle">
                <button className={`mode-btn ${scoringMode === 'GUESSER' ? 'active' : ''}`}
                  onClick={() => handleScoringModeChange('GUESSER')}>🔍 guesser</button>
                <button className={`mode-btn ${scoringMode === 'OWNER' ? 'active' : ''}`}
                  onClick={() => handleScoringModeChange('OWNER')}>🎵 owner</button>
              </div>
            </div>

            <div className="final-scores">
              {sortedScores.map((s, i) => (
                <div key={s.uid} className="final-score-row" style={{
                  background: COLORS[i % COLORS.length] + '22',
                  borderColor: COLORS[i % COLORS.length]
                }}>
                  <span className="doodle-title rank-big">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                  <div className="final-avatar" style={{ background: COLORS[i % COLORS.length] }}>
                    {(s.player?.username || '?')[0].toUpperCase()}
                  </div>
                  <span className="doodle-title final-name">{s.player?.username}</span>
                  {s.uid === user?.id && <span className="badge you-badge-sm">you!</span>}
                  <span className="doodle-title final-pts">{s.score} pts</span>
                </div>
              ))}
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button className="btn btn-blue big-action-btn" onClick={() => navigate('landing')}>
              🏠 back to home
            </button>
          </div>
        )}

        {error && phase !== 'finished' && <div className="error-msg game-error">{error}</div>}
      </div>
    </div>
  )
}