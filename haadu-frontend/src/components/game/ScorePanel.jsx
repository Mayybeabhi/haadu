import Card from '../ui/Card'
import Button from '../ui/Button'
import { getPlayerIcons } from '../../utils/playerIcon'

export default function ScorePanel({
  scores = [],
  players = [],
  adminUserId,
  scoringMode,
  onChangeMode,
}) {
  const playerIcons = getPlayerIcons(players)

  const sortedScores = [...scores].sort(
    (a, b) => b.score - a.score
  )

  return (
    <Card className="arcade-scoreboard">
      <div className="scoreboard-toolbar">
        <div className="scoreboard-title">
          <span>▥</span> LEADERBOARD
        </div>

        <div className="scoreboard-modes">
          <Button
            color={scoringMode === 'GUESSER' ? 'yellow' : 'white'}
            onClick={() => onChangeMode('GUESSER')}
          >
            Guesser
          </Button>

          <Button
            color={scoringMode === 'OWNER' ? 'yellow' : 'white'}
            onClick={() => onChangeMode('OWNER')}
          >
            Owner
          </Button>
        </div>
      </div>

      {sortedScores.length === 0 ? (
        <div className="scoreboard-empty">
          No scores yet
        </div>
      ) : (
        <div className="scoreboard-table-wrap">
          <table className="arcade-score-table">
            <thead>
              <tr>
                <th>#</th>
                <th>PLAYER</th>
                <th>POINTS</th>
              </tr>
            </thead>

            <tbody>
              {sortedScores.map((entry, index) => {
                const isAdmin =
                  String(entry.userId) === String(adminUserId)

                return (
                  <tr
                    key={entry.userId}
                    className={index === 0 ? 'score-leader' : ''}
                  >
                    <td className="score-rank">
                      {index + 1}
                    </td>

                    <td className="score-player">
                      <div className="leaderboard-player">
                        <img
                          src={
                            isAdmin
                              ? '/images/player-icons/Retro Neon Crown Sticker.png'
                              : playerIcons[entry.username]
                          }
                          alt={
                            isAdmin
                              ? 'Admin crown'
                              : `${entry.username} avatar`
                          }
                          className="leaderboard-player-icon"
                        />

                        <span>{entry.username}</span>
                      </div>
                    </td>

                    <td className="score-points">
                      {entry.score}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}