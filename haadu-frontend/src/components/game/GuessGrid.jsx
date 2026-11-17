
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
      <div className="grid-auto">
        {players
          .filter((p) => String(p.userId) !== String(currentUserId))
          .map((player) => {
            const isSelected =
              String(selectedGuess) === String(player.userId)

            return (
              <Button
                key={player.userId}
                className={isSelected ? 'guess-selected' : 'guess-not-selected'}
                color="yellow"
                disabled={!!selectedGuess}
                onClick={() => onGuess(player.userId)}
              >
                {isSelected && '✓ '}
                {player.username}
                {isSelected}
              </Button>
            )
          })}
      </div>
    </Card>
  )
}
