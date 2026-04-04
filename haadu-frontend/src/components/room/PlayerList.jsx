import Card from '../ui/Card'

const COLORS = ['#f7c948', '#4caf82', '#3d7fe8', '#e8453c', '#9b59b6', '#f39c12', '#e91e8c', '#1abc9c']

export default function PlayerList({ players = [], currentUserId }) {
  return (
    <Card>
      <div className="section-title">👥 players</div>
      <div className="stack" style={{ marginTop: 16 }}>
        {players.map((player, i) => (
          <div
            key={player.userId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              border: '2px solid #eee',
              borderRadius: 12,
              background: 'white',
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                border: '2px solid var(--ink)',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 900,
                background: COLORS[i % COLORS.length],
              }}
            >
              {(player.username || '?')[0]?.toUpperCase()}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800 }}>{player.username}</div>
              <div className="helper-text">
                Songs submitted: {player.songCount ?? 0}
              </div>
            </div>

            {player.userId === currentUserId && (
              <span className="badge" style={{ background: '#e8f5e9' }}>
                you
              </span>
            )}
            {player.isAdmin && (
              <span className="badge" style={{ background: '#fff3cd' }}>
                admin
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}