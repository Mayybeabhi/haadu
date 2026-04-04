import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { submitSong } from '../../api/songApi'

export default function SongSubmissionPanel({ roomCode, userId, onSubmitted }) {
  const [songs, setSongs] = useState([''])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const updateSong = (index, value) => {
    const next = [...songs]
    next[index] = value
    setSongs(next)
  }

  const addSongField = () => {
    setSongs((prev) => [...prev, ''])
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      for (const songUrl of songs.filter(Boolean)) {
        await submitSong(roomCode, {
          userId,
          youtubeUrl: songUrl,
        })
      }

      setMessage('Songs submitted successfully 🎵')
      onSubmitted?.()
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to submit songs')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <div className="section-title">🎶 submit songs</div>
      <div className="stack" style={{ marginTop: 16 }}>
        {songs.map((song, i) => (
          <Input
            key={i}
            placeholder={`Paste song URL ${i + 1}`}
            value={song}
            onChange={(e) => updateSong(i, e.target.value)}
          />
        ))}

        <div className="row">
          <Button color="yellow" onClick={addSongField}>
            + add another
          </Button>
          <Button color="green" onClick={handleSubmit} disabled={loading}>
            {loading ? 'submitting...' : 'submit songs'}
          </Button>
        </div>

        {message && <div className="success-text">{message}</div>}
        {error && <div className="error-text">{error}</div>}
      </div>
    </Card>
  )
}