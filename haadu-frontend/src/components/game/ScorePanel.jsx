import Card from '../ui/Card'
import Button from '../ui/Button'

export default function ScorePanel({
  scores = [],
  scoringMode,
  onChangeMode,
}) {

  const sortedScores = [...scores]
    .sort((a, b) => b.score - a.score)

  return (

    <Card className="stack">

      {/* HEADER */}

      <div
        className="row"
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >

        <div
          style={{
            fontSize: '1.3rem',
            fontWeight: 900,
          }}
        >
          📊 Scores
        </div>

        <div className="row">

          <Button
            color={
              scoringMode === 'GUESSER'
                ? 'blue'
                : 'white'
            }
            onClick={() =>
              onChangeMode('GUESSER')
            }
          >
            🔍 guesser
          </Button>

          <Button
            color={
              scoringMode === 'OWNER'
                ? 'purple'
                : 'white'
            }
            onClick={() =>
              onChangeMode('OWNER')
            }
          >
            🎵 owner
          </Button>

        </div>

      </div>

      {/* EMPTY */}

      {sortedScores.length === 0 && (

        <div className="helper-text">
          No scores yet
        </div>
      )}

      {/* SCORE TABLE */}

      {sortedScores.length > 0 && (

        <div
          style={{
            overflowX: 'auto',
            marginTop: 8,
          }}
        >

          <table
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '14px',
            }}
          >

            {/* USERNAMES */}

            <thead>

              <tr>

                {sortedScores.map((entry) => (

                  <th
                    key={entry.userId}
                    style={{
                      textAlign: 'center',
                      fontSize: '1rem',
                      fontWeight: 900,
                      whiteSpace: 'nowrap',
                    }}
                  >

                    {entry.username}

                  </th>
                ))}

              </tr>

            </thead>

            {/* SCORES */}

            <tbody>

              <tr>

                {sortedScores.map((entry, i) => (

                  <td
                    key={entry.userId}
                    style={{
                      textAlign: 'center',
                    }}
                  >

                    <div
                      style={{

                        display: 'inline-flex',

                        alignItems: 'center',

                        justifyContent: 'center',

                        gap: 8,

                        minWidth: '100px',

                        padding: '12px 18px',

                        borderRadius: 16,

                        background:
                          i === 0
                            ? '#fff3cd'
                            : 'white',

                        border:
                          i === 0
                            ? '2px solid #f7d774'
                            : '2px solid #ddd',

                        fontWeight: 900,

                        boxShadow:
                          '0 2px 6px rgba(0,0,0,0.08)',
                      }}
                    >

                      <span>
                        {
                          i === 0
                            ? '🥇'
                            : i === 1
                            ? '🥈'
                            : i === 2
                            ? '🥉'
                            : '#'
                        }
                      </span>

                      <span>
                        {entry.score} pts
                      </span>

                    </div>

                  </td>
                ))}

              </tr>

            </tbody>

          </table>

        </div>
      )}

    </Card>
  )
}