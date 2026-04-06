import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import PlayerList from '../components/room/PlayerList'
import RoomSettingsCard from '../components/room/RoomSettingsCard'
import SongSubmissionPanel from '../components/room/SongSubmissionPanel'
import { getGameState } from '../store/gameStore'
import { getRoomPlayers, getRoomDetails } from '../api/roomApi'
import { startGame } from '../api/gameApi'
import { createRoomSocket } from '../realtime/socket'

export default function LobbyPage() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = getGameState()

  const [room, setRoom] = useState(null)
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const socketRef = useRef(null)

  const loadData = async () => {
    try {
      const [roomData, playerData] = await Promise.all([
        getRoomDetails(roomCode),
        getRoomPlayers(roomCode),
      ])

      setRoom(roomData)
      setPlayers(playerData)
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
      await startGame(roomCode, user.id)
      navigate(`/room/${roomCode}/game`)
    } catch (e) {
      setError(e.response?.data?.message || 'Could not start game')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell stack">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="page-title" style={{ fontSize: '3rem', textAlign: 'left' }}>
            lobby 🎵
          </div>
          <div className="page-subtitle" style={{ textAlign: 'left' }}>
            waiting for everyone to submit songs
          </div>
        </div>

        <Badge style={{ background: '#fff3cd' }}>🏠 {roomCode}</Badge>
      </div>

      {error && <div className="error-text">{error}</div>}

      <div className="two-col">
        <div className="stack">
          <PlayerList players={players} currentUserId={user?.id} />

          <SongSubmissionPanel
            roomCode={roomCode}
            userId={user?.id}
            songCount={room?.songCount ?? 1}
            onSubmitted={loadData}
          />
        </div>

        <div className="stack">
          <RoomSettingsCard room={room} />

          {isAdmin && (
            <div className="card stack">
              <div className="section-title">🧠 admin controls</div>
              <div className="helper-text">
                Start only after everyone has submitted their songs.
              </div>

              <Button color="green" onClick={handleStartGame} disabled={loading}>
                {loading ? 'starting...' : '▶️ start game'}
              </Button>
            </div>
          )}

          {!isAdmin && (
            <div className="card stack">
              <div className="section-title">⏳ waiting</div>
              <div className="helper-text">
                The admin will start the game once all songs are in.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}