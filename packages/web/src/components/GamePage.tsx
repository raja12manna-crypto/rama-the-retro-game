import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { GameContainer } from './GameContainer'
import { leaderboardService, LeaderboardEntry } from '../services/leaderboardService'

export const GamePage = () => {
  const { user, logOut } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [gameEnded, setGameEnded] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    const scores = await leaderboardService.getTopScores(5)
    setLeaderboard(scores)
  }

  const handleGameEnd = async (finalScore: number) => {
    setScore(finalScore)
    setGameEnded(true)

    // Save score to Firebase
    if (user) {
      await leaderboardService.saveScore(
        user.uid,
        user.displayName || 'Anonymous',
        finalScore
      )
      
      // Reload leaderboard
      await loadLeaderboard()
    }
  }

  if (gameEnded) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
        color: '#f5f5f5',
        padding: '40px',
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#d4a574' }}>
          🎮 Game Over!
        </h1>
        <p style={{ fontSize: '32px', marginBottom: '40px', color: '#00ff00' }}>
          Score: {score} Points
        </p>

        <div style={{
          background: 'rgba(0,0,0,0.5)',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '30px',
          maxWidth: '600px',
        }}>
          <h2 style={{ color: '#d4a574', marginBottom: '20px' }}>
            🏆 Top Scores
          </h2>
          {leaderboard.length > 0 ? (
            <ol style={{ color: '#f5f5f5', fontSize: '16px' }}>
              {leaderboard.map((entry, index) => (
                <li key={entry.id} style={{ marginBottom: '10px' }}>
                  {index + 1}. <strong>{entry.playerName}</strong> - {entry.score} pts
                </li>
              ))}
            </ol>
          ) : (
            <p>No scores yet. Be the first!</p>
          )}
        </div>

        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '15px 40px',
            fontSize: '18px',
            background: 'linear-gradient(90deg, #8b0000, #d4a574)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginRight: '20px',
            fontWeight: 'bold',
          }}
        >
          ▶️ Play Again
        </button>

        <button
          onClick={logOut}
          style={{
            padding: '15px 40px',
            fontSize: '18px',
            background: '#555',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <div>
      <GameContainer onGameEnd={handleGameEnd} />
    </div>
  )
}