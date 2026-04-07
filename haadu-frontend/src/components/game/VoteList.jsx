import Card from '../ui/Card'

export default function VoteList({ players = [], guesses = [] }) {
  const getGuessForUser = (userId) => {
    return guesses.find(
      (guess) => String(guess.guessingUserId) === String(userId)
    )
  }

  const getUsernameById = (userId) => {
    return (
      players.find((player) => String(player.userId) === String(userId))
        ?.username || 'Unknown'
    )
  }

  return (
    <Card className="stack">
      <div className="section-title">🗳️ votes</div>

      <div className="stack">
        {players.map((player) => {
          const guess = getGuessForUser(player.userId)
          const votedFor = guess ? getUsernameById(guess.guessedUserId) : null

          return (
            <div key={player.userId} className="vote-row">
              <div className="vote-name">{player.username}</div>

              {guess ? (
                <div className="vote-pill submitted">
                  voted: {votedFor}
                </div>
              ) : (
                <div className="vote-pill waiting">waiting</div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}