import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import { createGuestUser } from '../api/userApi'
import { setGameState } from '../store/gameStore'

export default function GuestNamePage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleContinue = async () => {
    if (!name.trim()) return

    setLoading(true)
    setError('')

    try {
      const user = await createGuestUser(name.trim())
      setGameState({ user, isAdmin: false, room: null, players: [] })
      navigate('/rooms')
    } catch (e) {
      setError(e.response?.data?.message || 'Could not create guest user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell center">
      <div className="big-center-card stack animate-in">
        <div className="page-title">your name?</div>
        <div className="page-subtitle">
          pick a fun name before entering the chaos 🎵
        </div>

        <Card className="stack">
          <Input
            placeholder="Enter your guest name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
          />

          <Button color="blue" onClick={handleContinue} disabled={loading}>
            {loading ? 'creating...' : 'ok lets go'}
          </Button>

          {error && <div className="error-text">{error}</div>}
        </Card>
      </div>
    </div>
  )
}