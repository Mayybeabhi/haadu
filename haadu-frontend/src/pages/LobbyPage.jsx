
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Button from '../components/ui/Button'
import PlayerList from '../components/room/PlayerList'
import RoomSettingsCard from '../components/room/RoomSettingsCard'
import SongSubmissionPanel from '../components/room/SongSubmissionPanel'

import { getGameState } from '../store/gameStore'
import { getRoomState } from '../api/roomApi'
import { startGame } from '../api/gameApi'
import { createRoomSocket } from '../realtime/socket'

import './LobbyPage.css'

export default function LobbyPage() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = getGameState()

  const [room, setRoom] = useState(null)
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const socketRef = useRef(null)

  const loadData = async () => {
    try {
      const state = await getRoomState(roomCode)

      setRoom({
        roomCode: state.roomCode,
        maxPlayers: state.maxPlayers,
        songCount: state.songCount,
        isInBetweenRoundTimerEnabled: state.breakTimeEnabled,
        inBetweenRoundTimer: state.breakTimeSeconds,
        isRoundTimerEnabled: state.roundTimeEnabled,
        roundTimer: state.roundTimeSeconds,
        status: state.roomStatus,
      })

      setPlayers(state.players || [])

      if (state.roomStatus === 'PLAYING' || state.currentRoundId) {
        navigate(`/room/${roomCode}/game`)
      }

      if (state.roomStatus === 'FINISHED') {
        navigate(`/room/${roomCode}/results`)
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Could not load room')
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/guest')
      return
    }

    loadData()

    socketRef.current = createRoomSocket(roomCode, (event) => {
      if (
        event.type === 'PLAYER_JOINED' ||
        event.type === 'SONG_SUBMITTED' ||
        event.type === 'ROOM_UPDATED'
      ) {
        loadData()
      }

      if (event.type === 'GAME_STARTED') {
        navigate(`/room/${roomCode}/game`)
      }
    })

    return () => {
      socketRef.current?.deactivate?.()
    }
  }, [roomCode])

  const handleStartGame = async () => {
    setLoading(true)
    setError('')

    try {
      await startGame(roomCode)
      navigate(`/room/${roomCode}/game`)
    } catch (e) {
      setError(e.response?.data?.message || 'Could not start game')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode)
      setCopied(true)

      window.setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      setError('Could not copy room code. Please copy it manually.')
    }
  }

  const songCount = room?.songCount ?? 1

  const submittedPlayers = players.filter(
    (player) => (player.songsSubmitted ?? 0) >= songCount
  ).length

  const allSongsSubmitted =
    players.length > 0 && submittedPlayers === players.length

  const progress =
    players.length > 0
      ? (submittedPlayers / players.length) * 100
      : 0

  return (
    <main className="lobby-page">
      <div className="lobby-grain" />
      <div className="lobby-scanlines" />

      <header className="lobby-nav">
        <a href="/" className="lobby-logo">
          HAADU<span>.</span>
        </a>

        <nav>
          <a href="/#how-to-play">HOW TO PLAY</a>
          <a href="/#about">ABOUT</a>
          <span className="lobby-equalizer">▮ ▮ ▮</span>
        </nav>
      </header>

      <section className="lobby-content">
        <div className="lobby-heading">
          <div className="lobby-eyebrow">
            FILE 04 / THE CONTROL ROOM
          </div>

          <h1>
            THE <span>LOBBY.</span>
          </h1>

          <div className="lobby-heading-underline" />
        </div>

        <div className="lobby-heading-description">
          <p>
            Gather your people. Load your tracks.
            <br />
            Let the music decide.
          </p>

          <div className="lobby-waveform" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="lobby-header-actions">
            <div className="lobby-room-code">
              <div className="lobby-room-code-info">
                <span>ROOM CODE</span>
                <strong>{roomCode}</strong>
              </div>

              <button
                type="button"
                className="lobby-copy-button"
                onClick={handleCopyRoomCode}
                aria-label="Copy room code"
                title="Copy room code"
              >
                {copied ? 'COPIED ✓' : 'COPY ↗'}
              </button>
            </div>

            <div className="lobby-session-badge">
              <span className="lobby-live-dot" />
              SESSION IN PROGRESS
            </div>
          </div>
        </div>

        {error && (
          <div className="lobby-error">
            {error}
          </div>
        )}

        <div className="lobby-dashboard">
          <div className="lobby-column lobby-left-column">
            <div className="lobby-section-label">
              <span>01 / ARTIST LINEUP</span>
              <span className="lobby-label-icon green">♟</span>
            </div>

            <div className="lobby-panel lobby-player-panel">
              <div className="lobby-panel-heading">
                <span className="green">♟</span>
                PLAYERS
              </div>

              <PlayerList
                players={players}
                currentUserId={user?.id}
              />
            </div>

            <div className="lobby-panel lobby-progress-panel">
              <div className="lobby-progress-heading">
                <span>SUBMISSION PROGRESS</span>
                <strong>
                  {submittedPlayers}/{players.length}
                </strong>
              </div>

              <div className="lobby-progress-track">
                <div
                  className="lobby-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p>
                Players who have submitted all their tracks.
              </p>
            </div>
          </div>

          <div className="lobby-column lobby-center-column">
            <div className="lobby-section-label">
              <span className="green">♫</span>
              <span>02 / TRACK RECORDING</span>
            </div>

            <div className="lobby-panel lobby-console">
              <div className="lobby-console-heading">
                <div>
                  <div className="lobby-input-channel">
                    INPUT CHANNEL
                  </div>

                  <h2>SUBMIT YOUR TRACKS</h2>
                </div>

                <div className="lobby-track-count">
                  <strong>{songCount}</strong>
                  <span>TRACKS</span>
                </div>
              </div>

              <SongSubmissionPanel
                roomCode={roomCode}
                songCount={songCount}
                onSubmitted={loadData}
              />
            </div>

            <div className="lobby-console-note">
              <span className="lobby-live-dot" />
              YOUTUBE LINKS ONLY / ONE TRACK PER CHANNEL
            </div>
          </div>

          <div className="lobby-column lobby-right-column">
            <div className="lobby-section-label">
              <span>03 / STUDIO SETTINGS</span>
              <span className="lobby-label-icon green">⚙</span>
            </div>

            <div className="lobby-panel lobby-settings-panel">
              <div className="lobby-panel-heading">
                <span className="green">⚙</span>
                ROOM SETTINGS
              </div>

              <RoomSettingsCard room={room} />
            </div>

            <div className="lobby-panel lobby-status-panel">
              <div className="lobby-panel-heading">
                <span className="green">⌛</span>
                SESSION STATUS
              </div>

              <h2 className={allSongsSubmitted ? 'ready' : ''}>
                {allSongsSubmitted
                  ? 'ALL TRACKS LOADED'
                  : 'WAITING FOR TRACKS'}
              </h2>

              <p>
                {allSongsSubmitted
                  ? 'Everyone has submitted their songs. The host can start the game.'
                  : 'The session will begin once every player has submitted all their songs.'}
              </p>

              <div className="lobby-status-divider" />

              {isAdmin ? (
                <div className="lobby-admin-action">
                  <span className="lobby-yellow-dot" />
                  <span>YOU ARE THE HOST</span>

                  <Button
                    color="green"
                    className="lobby-start-button"
                    onClick={handleStartGame}
                    disabled={loading}
                  >
                    {loading ? 'STARTING...' : 'START GAME →'}
                  </Button>
                </div>
              ) : (
                <div className="lobby-waiting-host">
                  <span className="lobby-yellow-dot" />
                  WAITING FOR THE HOST
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="lobby-bottom-strip">
        <span>♫ BRING YOUR SONGS</span>
        <span>▪ GUESS THE SUBMITTER</span>
        <span>▪ SCORE POINTS</span>
        <span>▪ CROWN THE MUSIC EXPERT</span>
        <span>♫</span>
      </footer>
    </main>
  )
}
