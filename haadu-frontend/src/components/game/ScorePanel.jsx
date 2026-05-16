import Card from '../ui/Card'
import Button from '../ui/Button'

const COLORS = ['#f7c948', '#4caf82', '#3d7fe8', '#e8453c', '#9b59b6', '#f39c12', '#e91e8c', '#1abc9c']

export default function ScorePanel({
  scores = [],
  players = [],
  currentUserId,
  scoringMode,
  onChangeMode,
}) {
  const sortedScores = [...scores]
  .sort((a, b) => b.score - a.score)

  return (
    <Card>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="section-title">📊 scores</div>
        <div className="row">
          <Button
            color={scoringMode === 'GUESSER' ? 'blue' : 'white'}
            onClick={() => onChangeMode('GUESSER')}
          >
            🔍 guesser
          </Button>
          <Button
            color={scoringMode === 'OWNER' ? 'purple' : 'white'}
            onClick={() => onChangeMode('OWNER')}
          >
            🎵 owner
          </Button>
        </div>
      </div>

      <div className="stack" style={{ marginTop: 16 }}>
        {sortedScores.length === 0 && (
          <div className="helper-text">No scores yet</div>
        )}

        {sortedScores.map((entry, i) => (
          <div
            key={entry.userId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              border: '2px solid #eee',
              borderRadius: 12,
              background: i === 0 ? '#fffde7' : 'white',
            }}
          >
            <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
            </div>

            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '2px solid var(--ink)',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 900,
                background: COLORS[i % COLORS.length],
              }}
            >
              {(entry.username || '?')[0]?.toUpperCase()}
            </div>

            <div style={{ flex: 1, fontWeight: 800 }}>
              {entry.username}
            </div>

            {String(entry.userId) === String(currentUserId) && (
              <span className="badge" style={{ background: '#e8f5e9' }}>
                you
              </span>
            )}

            <div style={{ fontWeight: 900, color: 'var(--red)' }}>
              {entry.score} pts
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}