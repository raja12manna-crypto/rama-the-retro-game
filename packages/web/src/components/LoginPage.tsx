import { useAuth } from '../hooks/useAuth'

export const LoginPage = () => {
  const { signInWithGoogle, loading } = useAuth()

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
      color: '#f5f5f5',
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>🏹 RAMA</h1>
      <h2 style={{ fontSize: '24px', marginBottom: '40px', color: '#d4a574' }}>
        The Retro Game
      </h2>
      <p style={{ fontSize: '16px', marginBottom: '30px' }}>
        Experience the legend. Master the movement.
      </p>

      <button
        onClick={handleSignIn}
        disabled={loading}
        style={{
          padding: '15px 40px',
          fontSize: '18px',
          background: 'linear-gradient(90deg, #8b0000, #d4a574)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.5 : 1,
          fontWeight: 'bold',
        }}
      >
        {loading ? '⏳ Checking...' : '▶️ Play with Google'}
      </button>
    </div>
  )
}