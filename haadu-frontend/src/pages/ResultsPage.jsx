import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getRoomPlayers } from '../api/roomApi'
import { getScores } from '../api/scoreApi'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

import RoundHistoryTable from '../components/game/RoundHistoryTable'

import { getRoundHistory } from '../api/scoreApi'

export default function ResultsPage() {
  const { roomCode } = useParams()
  const navigate = useNavigate()

  const [players, setPlayers] = useState([])
  const [mode, setMode] = useState('GUESSER')
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [roundHistory, setRoundHistory] = useState([])

  useEffect(() => {

  async function load() {

    try {

      const data =
        await getRoundHistory(roomCode)

      setRoundHistory(data)

    } catch (e) {

      console.error(e)
    }
  }

  load()

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

  // 🔥 Compute leaderboard safely
  const sorted = useMemo(() => {
    if (!players.length || !scores) return []

    return [...scores]
  .sort((a, b) => b.score - a.score)
  }, [scores, players])

  const topScore = sorted[0]?.score ?? 0

  const winners = sorted.filter((x) => x.score === topScore)

  return (
    <div className="page-shell center">
      <div className="big-center-card stack animate-in" style={{ maxWidth: '1400px' }}>
        <div className="page-title">winner time 🏆</div>
        <div className="page-subtitle">
          final standings based on selected scoring mode
        </div>

        {/* 🔴 Error */}
        {error && <div className="error-text">{error}</div>}

        {/* 🟡 Loading */}
        {loading && <div className="helper-text">loading results...</div>}

        <Card className="stack center">
          {/* 🔁 Mode Toggle */}
          <div className="row">
            <Button
              color={mode === 'GUESSER' ? 'blue' : 'white'}
              disabled={loading}
              onClick={() => {
                setMode('GUESSER')
                load('GUESSER')
              }}
            >
              🔍 guesser mode
            </Button>

            <Button
              color={mode === 'OWNER' ? 'purple' : 'white'}
              disabled={loading}
              onClick={() => {
                setMode('OWNER')
                load('OWNER')
              }}
            >
              🎵 owner mode
            </Button>
          </div>

          {/* 👑 Winners */}
          <div className="section-title" style={{ textAlign: 'center' }}>
            👑 Winner{winners.length > 1 ? 's' : ''}
          </div>

          <div className="stack" style={{ width: '100%' }}>
            {winners.length === 0 && !loading && (
              <div className="helper-text">No winners yet</div>
            )}

            {winners.map((winner) => (
              <div
                key={winner.userId}
                style={{
                  background: '#fff7c2',
                  border: '3px solid var(--ink)',
                  borderRadius: 16,
                  padding: '16px 22px',
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  textAlign: 'center',
                  boxShadow: '5px 5px 0 var(--ink)',
                }}
              >
                {winner.username} — {winner.score} pts
              </div>
            ))}
          </div>

          {/* 📊 Leaderboard */}
          <div className="stack" style={{ width: '100%' }}>
            {sorted.length === 0 && !loading && (
              <div className="helper-text">No scores yet</div>
            )}

            {sorted.map((entry, i) => {
              const isWinner = entry.score === topScore

              return (
                <div
                  key={entry.userId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    border: '2px solid #eee',
                    borderRadius: 12,
                    background: isWinner ? '#fff7c2' : 'white',
                  }}
                >
                  <div style={{ fontWeight: 800 }}>
                    {i + 1}. {entry.username}
                  </div>
                  <div style={{ fontWeight: 900 }}>
                    {entry.score} pts
                  </div>
                </div>
              )
            })}
          </div>

          <RoundHistoryTable rounds={roundHistory} players={players}/> 

          {/* 🔁 Play Again */}
          <Button
            color="green"
            disabled={loading}
            onClick={() => navigate('/rooms')}
          >
            🔁 play again
          </Button>
        </Card>
      </div>
    </div>
  )
}