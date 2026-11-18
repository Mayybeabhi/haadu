import Card from '../ui/Card'
import { getPlayerIcons } from '../../utils/playerIcon'

export default function PlayerList({ players = [], currentUserId }) {
  const playerIcons = getPlayerIcons(players)

  return (
    <Card>
      <div className="section-title">players</div>

      <div className="stack" style={{ marginTop: 16 }}>
        {players.map((player) => {
          const isYou = String(player.userId) === String(currentUserId)

          return (
            <div
              key={player.userId}
              className="row"
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                borderRadius: 12,
                background: isYou
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(255,255,255,0.04)',
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>
                  {player.username} {isYou ? '(you)' : ''}
                </div>

                <div className="helper-text" style={{ marginTop: 4 }}>
                  Songs submitted: {player.songsSubmitted ?? 0}
                </div>
              </div>

              <div className="player-avatar">
                {player.isAdmin ? (
                  <img
                    src="/images/player-icons/Retro Neon Crown Sticker.png"
                    alt="Admin crown"
                    className="player-musical-icon"
                  />
                ) : (
                  <img
                    src={playerIcons[player.username]}
                    alt={`${player.username} avatar`}
                    className="player-musical-icon"
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}