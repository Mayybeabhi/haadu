import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getGameState } from '../store/gameStore'
import { getRoomPlayers } from '../api/roomApi'
import { getSongById } from '../api/songApi'
import { getScores } from '../api/scoreApi'
import { startRound, submitGuess, endRound, endGame } from '../api/gameApi'
import { createRoomSocket } from '../realtime/socket'
import GameHeader from '../components/game/GameHeader'
import ScorePanel from '../components/game/ScorePanel'
import YoutubePlayer from '../components/game/YoutubePlayer'
import GuessGrid from '../components/game/GuessGrid'
import VoteList from '../components/game/VoteList'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { getRoomState } from '../api/roomApi'

export default function GamePage() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin, scoringMode: initialMode } = getGameState()

  const [players, setPlayers] = useState([])
  const [phase, setPhase] = useState('waiting')
  const [showScores, setShowScores] = useState(false)
  const [scoringMode, setScoringMode] = useState(initialMode || 'GUESSER')
  const [scores, setScores] = useState({})
  const [roundNumber, setRoundNumber] = useState(0)
  const [currentRound, setCurrentRound] = useState(null)
  const [currentSongUrl, setCurrentSongUrl] = useState('')
  const [myGuess, setMyGuess] = useState(null)
  const [allGuesses, setAllGuesses] = useState([])
  const [revealedOwner, setRevealedOwner] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const socketRef = useRef(null)
  
  const hydrateGameState = async () => {
  try {
    const state = await getRoomState(roomCode)

    if (state.roomStatus === 'FINISHED') {
      navigate(`/room/${roomCode}/results`)
      return
    }

    setPlayers(state.players || [])

    if (!state.currentRoundId) {
      setPhase('waiting')
      setCurrentRound(null)
      setCurrentSongUrl('')
      setAllGuesses([])
      setMyGuess(null)
      setRevealedOwner(null)
      setRoundNumber(0)
      return
    }

    setRoundNumber(state.roundNumber || 0)

    setCurrentRound({
      id: state.currentRoundId,
      songId: state.songId,
    })

    setCurrentSongUrl(state.currentSongUrl || '')
    setAllGuesses(state.guesses || [])

    const existingMyGuess = (state.guesses || []).find(
      (g) => String(g.guessingUserId) === String(user?.id)
    )

    setMyGuess(existingMyGuess?.guessedUserId || null)

    if (state.roundStatus === 'PLAYING') {
      setPhase('playing')
      setRevealedOwner(null)
    } else if (state.roundStatus === 'REVEALED') {
      setPhase('revealed')
      setRevealedOwner(state.revealedOwnerId || null)
      loadScores()
    } else {
      setPhase('waiting')
      setRevealedOwner(null)
    }
  } catch (e) {
    console.error('Failed to hydrate game state', e)
    setError('Could not restore game state')
  }
}

  

  const loadScores = async (mode = scoringMode) => {
    try {
      const data = await getScores(roomCode, mode)
      setScores(data)
    } catch {}
  }

  useEffect(() => {
    if (!user) {
      navigate('/guest')
      return
    }

    
    hydrateGameState()

    socketRef.current = createRoomSocket(roomCode, async (event) => {
      if (event.type === 'ROUND_STARTED') {
  const { roundNumber, roundId, songId, youtubeUrl } = event.payload

  setPhase('playing')
  setRoundNumber(roundNumber)
  setCurrentRound({ id: roundId, songId })
  setCurrentSongUrl(youtubeUrl || '')
  setMyGuess(null)
  setAllGuesses([])
  setRevealedOwner(null)
}

      if (event.type === 'GUESS_SUBMITTED') {
  setAllGuesses((prev) => {
    const filtered = prev.filter(
      (g) => String(g.guessingUserId) !== String(event.payload.guessingUserId)
    )

    return [
      ...filtered,
      {
        guessingUserId: event.payload.guessingUserId,
        guessedUserId: event.payload.guessedUserId,
      },
    ]
  })
}

      if (event.type === 'ROUND_CLOSED') {
        setPhase('revealed')
        setRevealedOwner(event.payload.correctUserId)
        loadScores()
      }

      if (event.type === 'GAME_FINISHED') {
        navigate(`/room/${roomCode}/results`)
      }
    })

    return () => {
      socketRef.current?.deactivate?.()
    }
  }, [roomCode])

  const handleStartRound = async () => {
    setLoading(true)
    setError('')
    try {
      await startRound(roomCode, user.id)
    } catch (e) {
      setError(e.response?.data?.message || 'Could not start round')
    } finally {
      setLoading(false)
    }
  }

  const handleGuess = async (guessedUserId) => {
  if (!currentRound || myGuess) return

  if (!currentRound?.id) {
    setError('Round ID missing. Please refresh.')
    return
  }

  setLoading(true)
  setError('')
  try {
    await submitGuess(roomCode, currentRound.id, {
      guessingUserId: user.id,
      guessedUserId,
    })
    setMyGuess(guessedUserId)
  } catch (e) {
    setError(e.response?.data?.message || 'Could not submit guess')
  } finally {
    setLoading(false)
  }
}

  const handleEndRound = async () => {
    if (!currentRound) return

    setLoading(true)
    setError('')
    try {
      await endRound(roomCode, currentRound.id, user.id)
    } catch (e) {
      setError(e.response?.data?.message || 'Could not end round')
    } finally {
      setLoading(false)
    }
  }

  const handleEndGame = async () => {
    setLoading(true)
    setError('')
    try {
      await endGame(roomCode, user.id)
      navigate(`/room/${roomCode}/results`)
    } catch (e) {
      setError(e.response?.data?.message || 'Could not end game')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell stack">
      <GameHeader
        roomCode={roomCode}
        showScores={showScores}
        onToggleScores={() => {
          setShowScores((prev) => !prev)
          loadScores()
        }}
      />

      {showScores && (
        <ScorePanel
          scores={scores}
          players={players}
          currentUserId={user?.id}
          scoringMode={scoringMode}
          onChangeMode={(mode) => {
            setScoringMode(mode)
            loadScores(mode)
          }}
        />
      )}

      {error && <div className="error-text">{error}</div>}

      {phase === 'waiting' && (
        <Card className="stack center" style={{ minHeight: 300 }}>
          <div className="section-title">🎮 game ready!</div>
          <div className="helper-text">
            Waiting for admin to start the first round.
          </div>

          {isAdmin ? (
            <Button color="green" onClick={handleStartRound} disabled={loading}>
              {loading ? 'starting...' : '▶️ start round 1'}
            </Button>
          ) : (
            <div className="badge">⏳ waiting for admin</div>
          )}
        </Card>
      )}

      {phase === 'playing' && (
        <div className="two-col">
          <div className="stack">
            <Card>
              <div className="section-title">🎵 round {roundNumber}</div>
            </Card>

            <YoutubePlayer url={currentSongUrl} />

            <GuessGrid
              players={players}
              currentUserId={user?.id}
              selectedGuess={myGuess}
              onGuess={handleGuess}
            />
          </div>

          <div className="stack">
            <VoteList players={players} guesses={allGuesses} />

            {isAdmin && (
              <Card className="stack">
                <div className="section-title">🧠 admin controls</div>
                <Button color="yellow" onClick={handleEndRound} disabled={loading}>
                  reveal answer
                </Button>
              </Card>
            )}
          </div>
        </div>
      )}

      {phase === 'revealed' && (
        <Card className="stack center" style={{ minHeight: 320 }}>
          <div className="section-title">🎉 answer revealed</div>

          <div className="helper-text">The song owner was:</div>

          <div
            style={{
              fontSize: '2rem',
              fontWeight: 900,
              background: 'var(--yellow)',
              padding: '14px 28px',
              borderRadius: 16,
              border: '3px solid var(--ink)',
              boxShadow: '4px 4px 0 var(--ink)',
            }}
          >
            {players.find((p) => String(p.userId) === String(revealedOwner))
              ?.username || 'Unknown'}
          </div>

          
            <div className="row">
              {isAdmin && (
              <Button color="green" onClick={handleStartRound} disabled={loading}>
                ▶️ next round
              </Button>)}
              <Button color="purple" onClick={handleEndGame} disabled={loading}>
                🏆 reveal winner
              </Button>
            </div>
          
        </Card>
      )}
    </div>
  )
}