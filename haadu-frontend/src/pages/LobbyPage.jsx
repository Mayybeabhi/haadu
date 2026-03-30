import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import './LobbyPage.css'

export default function LobbyPage({ navigate, user, room: initialRoom, isAdmin }) {
  const [room, setRoom] = useState(initialRoom)
  const [players, setPlayers] = useState([])
  const [songs, setSongs] = useState([])
  const [songInputs, setSongInputs] = useState([''])
  const [showSongForm, setShowSongForm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const stompRef = useRef(null)
  const pollRef = useRef(null)
  const roomCode = initialRoom.roomCode
  const songCountTarget = room?.songCount || 3

  const fetchPlayers = async () => {
    try {
      const res = await axios.get(`/api/rooms/${roomCode}/players`)
      setPlayers(res.data)
    } catch {}
  }

  const fetchRoom = async () => {
    try {
      const res = await axios.get(`/api/rooms/${roomCode}`)
      setRoom(res.data)
      if (res.data.status === 'PLAYING') {
        clearInterval(pollRef.current)
        navigate('game', { user, room: res.data, isAdmin })
      }
      return res.data
    } catch {}
  }

  useEffect(() => {
    fetchPlayers()
    fetchRoom()

    // Poll every 3s as fallback for missing WS events
    pollRef.current = setInterval(() => {
      fetchPlayers()
      fetchRoom()
    }, 3000)

    const sock = new SockJS('/ws')
    const stomp = new Client({
      webSocketFactory: () => sock,
      reconnectDelay: 3000,
      onConnect: () => {
        stomp.subscribe(`/topic/rooms/${roomCode}`, (msg) => {
          const event = JSON.parse(msg.body)
          if (event.type === 'PLAYER_JOINED' || event.type === 'ROOM_CREATED') {
            fetchPlayers()
          }
          if (event.type === 'GAME_STARTED') {
            clearInterval(pollRef.current)
            fetchRoom()
          }
        })
      },
    })
    stomp.activate()
    stompRef.current = stomp

    return () => {
      stomp.deactivate()
      clearInterval(pollRef.current)
    }
  }, [])

  const handleStartGame = async () => {
    setLoading(true)
    setError('')
    try {
      await axios.post(`/api/rooms/${roomCode}/start`, { adminUserId: user.id })
      // Don't wait for WS — fetch room immediately and navigate
      const res = await axios.get(`/api/rooms/${roomCode}`)
      clearInterval(pollRef.current)
      navigate('game', { user, room: res.data, isAdmin })
    } catch (e) {
      setError(e.response?.data?.message || 'Cannot start game yet!')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitSongs = async () => {
    const validSongs = songInputs.filter(s => s.trim())
    if (validSongs.length === 0) return
    setLoading(true)
    setError('')
    try {
      for (const url of validSongs) {
        await axios.post(`/api/rooms/${roomCode}/songs`, {
          userId: user.id,
          youtubeUrl: url.trim(),
        })
      }
      setSongs(prev => [...prev, ...validSongs.filter(s => s.trim())])
      setSongInputs([''])
      setShowSongForm(false)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to submit songs')
    } finally {
      setLoading(false)
    }
  }

  const addSongInput = () => {
    if (songInputs.length < songCountTarget - songs.length) {
      setSongInputs(prev => [...prev, ''])
    }
  }

  const remaining = songCountTarget - songs.length

  return (
    <div className="lobby-page">
      <div className="lobby-top">
        <div className="room-code-display">
          <span className="doodle-title code-label">room code</span>
          <div className="code-box" onClick={() => {
            navigator.clipboard.writeText(roomCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}>
            <span className="doodle-title code-text">{roomCode}</span>
            <span className="copy-hint">{copied ? '✅ copied!' : '📋 click to copy'}</span>
          </div>
        </div>

        <div className="room-meta">
          <span className="badge" style={{ background: '#e8f5e9' }}>👥 max {room.maxPlayers}</span>
          <span className="badge" style={{ background: '#fff3e0' }}>🎵 {room.songCount} songs each</span>
          {room.isRoundTimerEnabled && <span className="badge" style={{ background: '#e3f2fd' }}>⏱️ {room.roundTimer}s rounds</span>}
        </div>
      </div>

      <div className="lobby-body">
        <div className="card lobby-panel">
          <div className="doodle-title panel-title">👥 players ({players.length}/{room.maxPlayers})</div>
          <div className="players-list">
            {players.map((p, i) => (
              <div className="player-row" key={p.userId}>
                <div className="player-avatar" style={{ background: COLORS[i % COLORS.length] }}>
                  {p.username[0].toUpperCase()}
                </div>
                <div className="player-info">
                  <span className="player-name doodle-title">{p.username}</span>
                  {p.isAdmin && <span className="badge admin-badge">👑 admin</span>}
                  {p.userId === user?.id && <span className="badge you-badge">you!</span>}
                </div>
              </div>
            ))}
            {players.length < room.maxPlayers && (
              <div className="waiting-slot doodle-title">waiting... <span className="dots">...</span></div>
            )}
          </div>
        </div>

        <div className="card lobby-panel">
          <div className="doodle-title panel-title">🎵 your songs ({songs.length}/{songCountTarget})</div>

          {songs.length > 0 && (
            <div className="submitted-songs">
              {songs.map((s, i) => (
                <div key={i} className="song-chip">
                  <span className="song-num doodle-title">{i + 1}.</span>
                  <span className="song-url">{truncateUrl(s)}</span>
                  <span className="song-check">✅</span>
                </div>
              ))}
            </div>
          )}

          {remaining > 0 && !showSongForm && (
            <button className="btn btn-yellow submit-song-btn" onClick={() => setShowSongForm(true)}>
              + add {remaining} more song{remaining > 1 ? 's' : ''}
            </button>
          )}

          {showSongForm && (
            <div className="song-form">
              {songInputs.map((val, i) => (
                <div key={i} className="song-input-row">
                  <span className="doodle-title song-num">{songs.length + i + 1}.</span>
                  <input
                    className="input"
                    placeholder="paste youtube url..."
                    value={val}
                    onChange={e => {
                      const copy = [...songInputs]
                      copy[i] = e.target.value
                      setSongInputs(copy)
                    }}
                  />
                </div>
              ))}
              {songInputs.length < remaining && (
                <button className="add-more-btn" onClick={addSongInput}>+ add another</button>
              )}
              <div className="song-form-actions">
                <button className="btn btn-green" onClick={handleSubmitSongs} disabled={loading}>
                  {loading ? 'submitting...' : '✅ submit!'}
                </button>
                <button className="btn btn-white" onClick={() => { setShowSongForm(false); setSongInputs(['']) }}>
                  cancel
                </button>
              </div>
            </div>
          )}

          {remaining === 0 && <div className="all-done doodle-title">🎉 all songs submitted!</div>}
          {error && <div className="error-msg" style={{ marginTop: 12 }}>{error}</div>}
        </div>
      </div>

      {isAdmin && (
        <div className="lobby-footer">
          <div className="doodle-title start-hint">everyone needs to submit their songs before you can start!</div>
          <button className="btn btn-red start-game-btn" onClick={handleStartGame} disabled={loading}>
            {loading ? 'starting...' : '🚀 start the game!'}
          </button>
          {error && <div className="error-msg">{error}</div>}
        </div>
      )}

      {!isAdmin && (
        <div className="lobby-footer">
          <div className="doodle-title waiting-text animate-wiggle">⏳ waiting for admin to start the game...</div>
        </div>
      )}
    </div>
  )
}

const COLORS = ['#f7c948', '#4caf82', '#3d7fe8', '#e8453c', '#9b59b6', '#f39c12', '#e91e8c', '#1abc9c']

function truncateUrl(url) {
  try {
    const u = new URL(url)
    const v = u.searchParams.get('v')
    return v ? `youtube.com/watch?v=${v}` : url.slice(0, 40)
  } catch {
    return url.length > 40 ? url.slice(0, 40) + '...' : url
  }
}