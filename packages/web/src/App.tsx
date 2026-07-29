import { useAuth } from './hooks/useAuth'
import { LoginPage } from './components/LoginPage'
import { GamePage } from './components/GamePage'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
        color: '#f5f5f5',
        fontSize: '24px',
      }}>
        ⏳ Loading...
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return <GamePage />
}

export default App