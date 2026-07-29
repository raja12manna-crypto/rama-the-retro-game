import { useState, useEffect } from 'react'
import { auth, googleProvider } from '../firebase-config'
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    } catch (error) {
      console.error('Sign-in error:', error)
      throw error
    }
  }

  const logOut = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Sign-out error:', error)
    }
  }

  return { user, loading, signInWithGoogle, logOut }
}