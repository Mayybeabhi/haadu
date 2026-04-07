import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function GameHeader({
  roomCode,
  onToggleScores,
  showScores,
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
      }}
    >
      <div>
        <div className="page-title" style={{ fontSize: '3rem', textAlign: 'left' }}>
          haadu 🎵
        </div>
      </div>

      <div className="row" style={{ alignItems: 'center' }}>
        <Button color="white" onClick={onToggleScores}>
          📊 {showScores ? 'hide scores' : 'scores'}
        </Button>
        <Badge style={{ background: '#fff3e0' }}>🏠 {roomCode}</Badge>
      </div>
    </div>
  )
}