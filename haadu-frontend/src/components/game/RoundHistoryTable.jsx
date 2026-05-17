import * as XLSX from 'xlsx'

export default function RoundHistoryTable({
  rounds = [],
  players = [],
}) {

  const exportExcel = () => {

    const rows = []

    rounds.forEach((round) => {

      const row = {
        Round: round.roundNumber,
        Song: round.youtubeUrl,
        Owner: round.ownerUsername,
      }

      players.forEach((player) => {

        const guess =
          round.playerGuesses?.[player.username]

        row[player.username] =
          guess
            ? `${guess.guessedUsername} ${guess.correct ? '(Correct)' : '(Wrong)'}`
            : '-'
      })

      rows.push(row)
    })

    const worksheet =
      XLSX.utils.json_to_sheet(rows)

    const workbook =
      XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Rounds'
    )

    XLSX.writeFile(
      workbook,
      'haadu-results.xlsx'
    )
  }

  if (!rounds?.length) {

    return (
      <div className="helper-text">
        No revealed rounds yet
      </div>
    )
  }

  return (

    <div className="stack">

      {/* EXPORT */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >

        <button
          onClick={exportExcel}
          style={{
            padding: '8px 14px',
            borderRadius: 12,
            border: '2px solid #ddd',
            background: 'white',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          ⬇ Export
        </button>

      </div>

      {/* TABLE */}

      <div
        style={{
          overflowX: 'auto',
          paddingBottom: 10,
        }}
      >

        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 16px',
            minWidth: '1000px',
          }}
        >

          <thead>

            <tr>

              <th style={headerStyle}>
                Round
              </th>

              <th style={headerStyle}>
                Song
              </th>

              <th style={headerStyle}>
                Owner
              </th>

              {players.map((player) => (

                <th
                  key={player.userId}
                  style={headerStyle}
                >
                  {player.username}
                </th>
              ))}

            </tr>

          </thead>

          <tbody>

            {rounds.map((round) => (

              <tr key={round.roundNumber}>

                {/* ROUND */}

                <td style={plainCellStyle}>
                  #{round.roundNumber}
                </td>

                {/* SONG */}

                <td style={plainCellStyle}>

                  <a
                    href={
                      round.youtubeUrl?.startsWith('http')
                        ? round.youtubeUrl
                        : `https://${round.youtubeUrl}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontWeight: 900,
                      textDecoration: 'none',
                      fontSize: '1.05rem',
                    }}
                  >
                    🎵 Listen
                  </a>

                </td>

                {/* OWNER */}

                <td
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                  }}
                >

                  <div
                    style={{
                      display: 'inline-flex',

                      alignItems: 'center',

                      justifyContent: 'center',

                      minWidth: '80px',

                      padding: '10px 14px',

                      borderRadius: '16px',

                      background: '#fff3cd',

                      fontWeight: 900,

                      border: '2px solid #f7d774',
                    }}
                  >

                    {round.ownerUsername}

                  </div>

                </td>

                {/* GUESSES */}

                {players.map((player) => {

                  const guess =
                    round.playerGuesses?.[player.username]

                  if (!guess) {

                    return (

                      <td
                        key={player.userId}
                        style={plainCellStyle}
                      >
                        -
                      </td>
                    )
                  }

                  return (

                    <td
                      key={player.userId}
                      style={{
                        padding: '8px',
                        textAlign: 'center',
                      }}
                    >

                      <div
                        style={{

                          display: 'inline-flex',

                          alignItems: 'center',

                          justifyContent: 'center',

                          minWidth: '80px',

                          padding: '10px 14px',

                          borderRadius: '16px',

                          fontWeight: 800,

                          background:
                            guess.correct
                              ? '#e8f5e9'
                              : '#ffebee',

                          color:
                            guess.correct
                              ? '#2e7d32'
                              : '#c62828',

                          border:
                            guess.correct
                              ? '2px solid #a5d6a7'
                              : '2px solid #ef9a9a',
                        }}
                      >

                        {guess.guessedUsername}

                      </div>

                    </td>
                  )
                })}

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}

const headerStyle = {

  padding: '12px 16px',

  textAlign: 'center',

  fontSize: '1rem',

  fontWeight: 900,
}

const plainCellStyle = {

  padding: '8px',

  textAlign: 'center',

  fontWeight: 700,
}