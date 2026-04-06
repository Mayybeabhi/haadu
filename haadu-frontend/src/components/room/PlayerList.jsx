import Card from '../ui/Card'

export default function PlayerList({ players = [], currentUserId }) {
  return (
    <Card>
      <div className="section-title">👥 players</div>

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
                background: isYou ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
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

              <div style={{ fontSize: '1.2rem' }}>
                {player.isAdmin ? '👑' : '🎧'}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}