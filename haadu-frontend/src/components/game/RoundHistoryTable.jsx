
import * as XLSX from 'xlsx'

function getYouTubeId(url = '') {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/\s]+)/
  )

  return match?.[1] || null
}

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
        const guess = round.playerGuesses?.[player.username]

        row[player.username] = guess
          ? `${guess.guessedUsername} ${guess.correct ? '(Correct)' : '(Wrong)'}`
          : '-'
      })

      rows.push(row)
    })

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rounds')
    XLSX.writeFile(workbook, 'haadu-results.xlsx')
  }

  if (!rounds?.length) {
    return <div className="helper-text">No revealed rounds yet</div>
  }

  return (
    <div className="stack round-history-content">
      <div className="round-history-export">
        <button onClick={exportExcel} className="round-export-btn">
          ↓ EXPORT
        </button>
      </div>

      <div className="round-history-table-wrap">
        <table className="round-history-table">
          <thead>
            <tr>
              <th>ROUND</th>
              <th>SONG</th>
              <th>OWNER</th>

              {players.map((player) => (
                <th key={player.userId}>{player.username}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rounds.map((round) => {
              const videoId = getYouTubeId(round.youtubeUrl)

              const songUrl = round.youtubeUrl?.startsWith('http')
                ? round.youtubeUrl
                : `https://${round.youtubeUrl}`

              return (
                <tr key={round.roundNumber}>
                  <td className="round-number-cell">
                    #{round.roundNumber}
                  </td>

                  <td className="round-song-cell">
                    <a
                      href={songUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="round-song-link"
                      title="Listen on YouTube"
                    >
                      {videoId ? (
                        <img
                          src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                          alt="Song thumbnail"
                          className="round-song-thumbnail"
                        />
                      ) : (
                        <span className="round-song-fallback">
                           OPEN TRACK
                        </span>
                      )}
                    </a>
                  </td>

                  <td className="round-owner-cell">
                    <span className="round-owner-badge">
                      {round.ownerUsername}
                    </span>
                  </td>

                  {players.map((player) => {
                    const guess = round.playerGuesses?.[player.username]

                    if (!guess) {
                      return (
                        <td key={player.userId} className="round-empty-cell">
                          —
                        </td>
                      )
                    }

                    return (
                      <td key={player.userId} className="round-guess-cell">
                        <span
                          className={`round-guess-badge ${
                            guess.correct
                              ? 'round-guess-correct'
                              : 'round-guess-wrong'
                          }`}
                        >
                          {guess.guessedUsername}
                          
                        </span>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
