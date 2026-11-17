
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getGameState } from '../store/gameStore'
import { getScores, getRoundHistory } from '../api/scoreApi'
import { getRoomState } from '../api/roomApi'
import {
  startRound,
  submitGuess,
  endRound,
  endGame,
} from '../api/gameApi'
import { createRoomSocket } from '../realtime/socket'

import GameHeader from '../components/game/GameHeader'
import ScorePanel from '../components/game/ScorePanel'
import YoutubePlayer from '../components/game/YoutubePlayer'
import GuessGrid from '../components/game/GuessGrid'
import RoundHistoryTable from '../components/game/RoundHistoryTable'
import Button from '../components/ui/Button'

import './GamePage.css'

export default function GamePage() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin, scoringMode: initialMode } = getGameState()

  const [players, setPlayers] = useState([])
  const [roundHistory, setRoundHistory] = useState([])
  const [phase, setPhase] = useState('waiting')
  const [scoringMode, setScoringMode] = useState(initialMode || 'GUESSER')
  const [scores, setScores] = useState([])
  const [roundNumber, setRoundNumber] = useState(0)
  const [totalRounds, setTotalRounds] = useState(0)
  const [currentRound, setCurrentRound] = useState(null)
  const [currentSongUrl, setCurrentSongUrl] = useState('')
  const [myGuess, setMyGuess] = useState(null)
  const [allGuesses, setAllGuesses] = useState([])
  const [revealedOwner, setRevealedOwner] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const socketRef = useRef(null)

  const loadScores = async (mode = scoringMode) => {
    try {
      const [scoreData, historyData] = await Promise.all([
        getScores(roomCode, mode),
        getRoundHistory(roomCode),
      ])

      setScores(scoreData || [])
      setRoundHistory(historyData || [])
    } catch (e) {
      console.error('Could not load scores', e)
    }
  }

  const hydrateGameState = async () => {
    try {
      const state = await getRoomState(roomCode)

      if (state.roomStatus === 'FINISHED') {
        navigate(`/room/${roomCode}/results`)
        return
      }

      const roomPlayers = state.players || []

setPlayers(roomPlayers)

const songsPerPlayer = Number(state.songCount) || 0
setTotalRounds(songsPerPlayer * roomPlayers.length)
      if (!state.currentRoundId) {
        setPhase('waiting')
        setCurrentRound(null)
        setCurrentSongUrl('')
        setAllGuesses([])
        setMyGuess(null)
        setRevealedOwner(null)
        setRoundNumber(0)
        await loadScores()
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
      } else {
        setPhase('waiting')
        setRevealedOwner(null)
      }

      await loadScores()
    } catch (e) {
      console.error('Failed to hydrate game state', e)
      setError('Could not restore game state')
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/guest')
      return
    }

    hydrateGameState()

    socketRef.current = createRoomSocket(roomCode, async (event) => {
      if (event.type === 'ROUND_STARTED') {
        const {
          roundNumber,
          roundId,
          songId,
          youtubeUrl,
        } = event.payload

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
            (g) =>
              String(g.guessingUserId) !==
              String(event.payload.guessingUserId)
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
  await hydrateGameState()
  await loadScores()
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
      await startRound(roomCode)
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
      await endRound(roomCode, currentRound.id)
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
      await endGame(roomCode)
      navigate(`/room/${roomCode}/results`)
    } catch (e) {
      setError(e.response?.data?.message || 'Could not end game')
    } finally {
      setLoading(false)
    }
  }

  const handleScoringModeChange = (mode) => {
    setScoringMode(mode)
    loadScores(mode)
  }

  const guesserCount = players.length
  const guessProgress = guesserCount
    ? Math.min((allGuesses.length / guesserCount) * 100, 100)
    : 0

  const ownerName =
    players.find(
      (p) => String(p.userId) === String(revealedOwner)
    )?.username || 'Unknown'
  
  const isLastRound =
  totalRounds > 0 && roundNumber >= totalRounds
  
  console.log('ROUND DEBUG:', {
  roundNumber,
  totalRounds,
  isLastRound,
  isAdmin,
})

  const getPlayerGuess = (playerId) =>
    allGuesses.find(
      (guess) => String(guess.guessingUserId) === String(playerId)
    )

  return (
    <div
    className="page-shell game-page"
    onClickCapture={() => {
      if (error) setError('')
    }}
  >
      <GameHeader
        roomCode={roomCode}
        roundNumber={roundNumber}
        totalRounds={totalRounds}
        phase={phase}
      />

      <main className="game-content">
        {/* INTRO */}
        <section className="game-intro">
          <div className="game-title-block">
            <span className="game-file-tag">FILE 05</span>
            <h1>
              THE <span>GAME.</span>
            </h1>
            <div className="game-title-underline" />
          </div>

          <p className="game-intro-copy">
            Guess the submitter. Score points.
            <br />
            Climb the leaderboard.
          </p>

          <div className="game-sound-wave" aria-hidden="true">
            {[18, 30, 44, 60, 76, 55, 40, 25, 16].map((height, i) => (
              <i key={i} style={{ height }} />
            ))}
          </div>

          <div className="game-room-info">
  {isAdmin && phase === 'playing' &&  players.length > 0 &&
  allGuesses.length >= players.length && (
    <div className="game-reveal-control">
      <Button
        color="yellow"
        onClick={handleEndRound}
        disabled={loading}
      >
        {loading ? 'REVEALING...' : 'REVEAL ANSWER'}
      </Button>
    </div>
  )}

  <div className="game-room-code">
    <small>ROOM CODE</small>
    <strong>{roomCode}</strong>
  </div>

  <div className="game-round-badge">
    <i />
    {phase === 'waiting' ? 'READY' : `ROUND ${roundNumber} / ${totalRounds}`}
  </div>
</div>
        </section>

        {error && (
          <div className="game-error">
            {error}
          </div>
        )}

        {/* MAIN THREE-COLUMN LAYOUT */}
        <section className="game-layout">

          {/* LEFT: PLAYERS */}
          <aside className="game-panel players-panel">
            <div className="game-paper-heading">
              PLAYERS ({players.length})
            </div>

            <div className="players-list">
              {players.map((player, index) => {
                const isYou =
                  String(player.userId) === String(user?.id)

                const guess = getPlayerGuess(player.userId)

                return (
                  <div
                    key={player.userId}
                    className={`player-tile ${isYou ? 'player-you' : ''}`}
                  >
                    <div className={`player-avatar avatar-${index % 5}`}>
                      {player.username?.charAt(0)?.toUpperCase()}
                    </div>

                    <div className="player-info">
                      <strong>
                        {player.username}
                        {isYou ? ' (you)' : ''}
                      </strong>

                      <span>
                        <i className={guess ? 'status-yellow' : ''} />
                        {isYou && isAdmin
                          ? 'Host'
                          : guess
                            ? 'Guessed'
                            : 'Online'}
                      </span>
                    </div>

                    {isYou && isAdmin && (
                      <span className="player-crown">♛</span>
                    )}
                  </div>
                )
              })}
            </div>
          </aside>

          {/* CENTRE: GAME */}
          <section className="game-main">

            {phase === 'waiting' && (
              <div className="game-stage waiting-stage">
                <div className="stage-vinyl">
                  <div className="stage-vinyl-label">
                    ♫
                    <small>HAADU</small>
                  </div>
                </div>

                <div className="stage-content">
                  <span className="stage-kicker">THE GAME FLOOR</span>
                  <h2>READY TO PLAY?</h2>
                  <p>Waiting for the host to start the first round.</p>

                  {isAdmin ? (
                    <Button
                      color="green"
                      onClick={handleStartRound}
                      disabled={loading}
                    >
                      {loading ? 'STARTING...' : 'START ROUND →'}
                    </Button>
                  ) : (
                    <div className="waiting-host">
                      ● WAITING FOR HOST
                    </div>
                  )}
                </div>
              </div>
            )}

            {phase === 'playing' && (
              <>
                <div className="game-stage playing-stage">
                  <div className="stage-vinyl">
                    <div className="stage-vinyl-label">
                      ♫
                      <small>HAADU</small>
                    </div>
                  </div>

                  <div className="stage-arm" />

                  <div className="stage-player">
                    <YoutubePlayer url={currentSongUrl} />
                  </div>
                </div>

                <div className="game-guess-area">
                  <div className="game-paper-heading guess-heading">
                    WHO SUBMITTED THIS SONG?
                  </div>

                  <GuessGrid
                    players={players}
                    currentUserId={user?.id}
                    selectedGuess={myGuess}
                    onGuess={handleGuess}
                  />

                  {myGuess && (
                    <div className="guess-feedback">
                      ✓ YOUR GUESS HAS BEEN SUBMITTED
                    </div>
                  )}

                  {loading && (
                    <div className="guess-feedback">
                      SUBMITTING...
                    </div>
                  )}
                </div>

                
              </>
            )}

            {phase === 'revealed' && (
              <div className="game-stage revealed-stage" >
                
                <h2 >TRACK OWNER REVEALED</h2>

                <div className="revealed-owner">
                  {ownerName}
                </div>

                <div className="revealed-actions">
  {isAdmin && !isLastRound && (
    <Button
      color="green"
      onClick={handleStartRound}
      disabled={loading}
    >
      NEXT ROUND →
    </Button>
  )}

  {isAdmin && isLastRound && (
    <Button
      color="purple"
      onClick={handleEndGame}
      disabled={loading}
    >
      REVEAL WINNER
    </Button>
  )}
</div>
              </div>
            )}
          </section>

          {/* RIGHT: SCORES AND ROUND INFO */}
          <aside className="game-sidebar">

            <section className="game-panel leaderboard-panel">
              <div className="game-paper-heading">
                <span>▥</span>
                LEADERBOARD
              </div>

              <ScorePanel
                scores={scores}
                scoringMode={scoringMode}
                onChangeMode={handleScoringModeChange}
              />
            </section>

            <section className="game-panel progress-panel">
              <h3>⚑ ROUND PROGRESS</h3>

              <div className="round-progress-steps">
                <div className={`progress-node ${phase !== 'waiting' ? 'active' : ''}`}>
                  <span>✓</span>
                  <small>PLAYING</small>
                </div>

                <div className={`progress-line ${phase === 'revealed' ? 'complete' : ''}`} />

                <div className={`progress-node ${phase === 'revealed' ? 'active' : ''}`}>
                  <span>2</span>
                  <small>REVEAL</small>
                </div>

                <div className="progress-line" />

                <div className="progress-node">
                  <span>3</span>
                  <small>NEXT</small>
                </div>
              </div>

              <div className="guess-progress-label">
                <span>GUESSES SUBMITTED</span>
                <strong>{allGuesses.length}/{guesserCount}</strong>
              </div>

              <div className="guess-progress-bar">
                <i style={{ width: `${guessProgress}%` }} />
              </div>
            </section>

            <section className="game-panel history-panel">
              <h3>◷ ROUND HISTORY</h3>

              <RoundHistoryTable
                rounds={roundHistory}
                players={players}
              />
            </section>
          </aside>
        </section>
      </main>

      <footer className="game-footer">
        <span>♫ &nbsp; BRING YOUR SONGS</span>
        <span>• &nbsp; GUESS THE SUBMITTER</span>
        <span>• &nbsp; SCORE POINTS</span>
        <span>• &nbsp; CROWN THE MUSIC EXPERT</span>
        <span>♫</span>
      </footer>
    </div>
  )
}
