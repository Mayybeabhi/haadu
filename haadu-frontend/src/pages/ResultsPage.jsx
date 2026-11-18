
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getRoomPlayers } from '../api/roomApi'
import { getScores, getRoundHistory } from '../api/scoreApi'
import Button from '../components/ui/Button'
import RoundHistoryTable from '../components/game/RoundHistoryTable'
import { getPlayerIcons } from '../utils/playerIcon'
import './ResultsPage.css'

export default function ResultsPage() {
  const { roomCode } = useParams()
  const navigate = useNavigate()

  const [players, setPlayers] = useState([])
  const [mode, setMode] = useState('GUESSER')
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [roundHistory, setRoundHistory] = useState([])

  const playerIcons = getPlayerIcons(players)
  const adminUserId = players.find((player => player.isAdmin))?.userId

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getRoundHistory(roomCode)
        setRoundHistory(data || [])
      } catch (e) {
        console.error(e)
      }
    }

    if (roomCode) loadHistory()
  }, [roomCode])

  const load = async (selectedMode = mode) => {
    try {
      setLoading(true)
      setError('')

      const [playerData, scoreData] = await Promise.all([
        getRoomPlayers(roomCode),
        getScores(roomCode, selectedMode),
      ])

      setPlayers(playerData || [])
      setScores(scoreData || [])
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load results')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!roomCode) return
    load()
  }, [roomCode])

  const sorted = useMemo(() => {
    return [...scores].sort((a, b) => b.score - a.score)
  }, [scores])

  const topScore = sorted[0]?.score ?? 0
  const winners = sorted.filter((x) => x.score === topScore)

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode)
    load(selectedMode)
  }

  return (
    <div className="results-page">
      <div className="results-scanlines" />

      {/* HEADER */}
      <header className="results-header">
        <a href="/" className="results-logo">
          HAADU<span>.</span>
        </a>

        <div className="results-header-divider" />

        <div className="results-header-label">
          THE GAME FLOOR
        </div>

        <nav className="results-nav">
          <a href="/how-to-play">HOW TO PLAY</a>
          <a href="/about">ABOUT</a>
          <div className="results-menu">
            <span />
            <span />
            <span />
          </div>
        </nav>
      </header>

      <main className="results-main">
        {/* TITLE */}
        <section className="results-heading">
          <div className="results-file-tag">FILE 06</div>

          <div className="results-title-row">
            <h1>
              WINNER <span>TIME.</span>
            </h1>

            <div className="results-heading-description">
              Final standings based on selected scoring mode.
              <br />
              The music never stops.
            </div>
          </div>
        </section>

        {error && (
          <div className="results-error">
            ⚠ {error}
          </div>
        )}

        {/* MAIN RESULTS GRID */}
        <div className="results-grid">

          {/* WINNERS */}
          <section className="results-winners-panel">
            <div className="champions-title">
  <span className="champions-crown">♛</span>
  {winners.length === 1 ? 'CHAMPION' : 'CHAMPIONS'}
</div>

            <div className="results-winners-content">
              {loading ? (
                <div className="results-empty">
                  LOADING RESULTS...
                </div>
              ) : winners.length === 0 ? (
                <div className="results-empty">
                  NO WINNERS YET
                </div>
              ) : (
                winners.map((winner, index) => {
                  const isAdmin =
                    String(winner.userId) === String(adminUserId)

                  return (
                    <div
                      key={winner.userId}
                      className="results-winner-card"
                    >
                      <div className="results-winner-rank">
                         ♛ 
                      </div>

                      <img
                        src={
                          isAdmin
                            ? '/images/player-icons/Retro Neon Crown Sticker.png'
                            : playerIcons[winner.username]
                        }
                        alt={`${winner.username} avatar`}
                        className="results-player-icon"
                      />

                      <div className="results-winner-name">
                        {winner.username}
                      </div>

                      <div className="results-winner-score">
                        {winner.score}
                        <span>PTS</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div className="results-champion-footer">
              
              {winners.length > 1
                ? 'IT’S A TIE!'
                : 'HIGH SCORE HOLDER'}
            </div>
          </section>

          {/* SCOREBOARD */}
          <section className="results-score-panel">
            <div className="results-panel-header">
              <div className="results-section-label">
                ▥ FINAL LEADERBOARD
              </div>

              <div className="results-mode-switch">
                <button
                  className={mode === 'GUESSER' ? 'active' : ''}
                  disabled={loading}
                  onClick={() => handleModeChange('GUESSER')}
                >
                GUESSER
                </button>

                <button
                  className={mode === 'OWNER' ? 'active' : ''}
                  disabled={loading}
                  onClick={() => handleModeChange('OWNER')}
                >
                OWNER
                </button>
              </div>
            </div>

            <div className="results-table-wrap">
              <table className="results-leaderboard">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>PLAYER</th>
                    <th>POINTS</th>
                  </tr>
                </thead>

                <tbody>
                  {sorted.map((entry, index) => {
                    const isWinner = entry.score === topScore
                    const isAdmin =
                      String(entry.userId) === String(adminUserId)

                    return (
                      <tr
                        key={entry.userId}
                        className={isWinner ? 'results-top-player' : ''}
                      >
                        <td className="results-rank">
                          {String(index + 1).padStart(2, '0')}
                        </td>

                        <td>
                          <div className="results-player-cell">
                            <img
                              src={
                                isAdmin
                                  ? '/images/player-icons/Retro Neon Crown Sticker.png'
                                  : playerIcons[entry.username]
                              }
                              alt=""
                              className="results-player-icon"
                            />

                            <span>{entry.username}</span>

                            {isWinner && (
                              <span className="results-winner-mark">
                                ♛
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="results-points">
                          {entry.score}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {!loading && sorted.length === 0 && (
                <div className="results-empty">
                  NO SCORES RECORDED
                </div>
              )}
            </div>

            <div className="results-score-footer">
              <span>FINAL SCORE</span>
              <span>
                {sorted.length} PLAYERS
              </span>
            </div>
          </section>

          {/* ROUND HISTORY */}
          <section className="results-history-panel">
            <div className="results-history-heading">
              <div className="results-section-label">
                ◴ ROUND HISTORY
              </div>

              <div className="results-history-subtitle">
                GAME RECAP // {roundHistory.length} ROUNDS
              </div>
            </div>

            <div className="results-history-content">
              <RoundHistoryTable
                rounds={roundHistory}
                players={players}
              />
            </div>
          </section>

        </div>

        {/* BOTTOM ACTION */}
        <div className="results-actions">
          <div className="results-end-message">
            
          </div>

          <Button
            color="green"
            disabled={loading}
            onClick={() => navigate('/rooms')}
          >
            ↻ PLAY AGAIN
          </Button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="results-footer">
        <span>BRING YOUR SONGS</span>
        <span>GUESS THE SUBMITTER</span>
        <span>SCORE POINTS</span>
        <span>GROW THE MUSIC EXPERT</span>
      </footer>
    </div>
  )
}
