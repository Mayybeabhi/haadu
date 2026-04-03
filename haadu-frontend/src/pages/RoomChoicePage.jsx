import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { getGameState } from '../store/gameStore'

export default function RoomChoicePage() {
  const navigate = useNavigate()
  const { user } = getGameState()

  if (!user) {
    navigate('/guest')
    return null
  }

  return (
    <div className="page-shell center">
      <div className="big-center-card stack animate-in">
        <div className="page-title">room time 🎵</div>
        <div className="page-subtitle">
          create a new room or jump into an existing one
        </div>

        <Card className="stack">
          <Button color="green" onClick={() => navigate('/rooms/create')}>
            🏗️ create room
          </Button>
          <Button color="yellow" onClick={() => navigate('/rooms/join')}>
            🚪 join room
          </Button>
        </Card>
      </div>
    </div>
  )
}