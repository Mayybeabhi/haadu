import Button from '../ui/Button'
import Card from '../ui/Card'

export default function GuessGrid({
  players = [],
  currentUserId,
  selectedGuess,
  onGuess,
}) {
  return (
    <Card>
      <div className="section-title" style={{ textAlign: 'center' }}>
        {selectedGuess ? '✅ guess submitted!' : '👇 who submitted this song?'}
      </div>

      <div className="grid-auto" style={{ marginTop: 18 }}>
        {players
          .filter((p) => String(p.userId) !== String(currentUserId))
          .map((player, i) => (
            <Button
              key={player.userId}
              color={['yellow', 'green', 'blue', 'red', 'purple', 'orange', 'pink'][i % 7]}
              disabled={!!selectedGuess}
              onClick={() => onGuess(player.userId)}
            >
              {player.username}
            </Button>
          ))}
      </div>
    </Card>
  )
}