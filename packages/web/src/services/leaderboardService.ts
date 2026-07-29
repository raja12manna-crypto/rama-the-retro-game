import { db } from '../firebase-config'
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from 'firebase/firestore'

export interface LeaderboardEntry {
  id: string
  playerName: string
  playerId: string
  enemiesDefeated: number
  timestamp: Timestamp
  score: number
}

export const leaderboardService = {
  async saveScore(
    playerId: string,
    playerName: string,
    enemiesDefeated: number
  ) {
    try {
      const score = enemiesDefeated * 100 // 100 points per enemy

      await addDoc(collection(db, 'leaderboard'), {
        playerId,
        playerName,
        enemiesDefeated,
        score,
        timestamp: Timestamp.now(),
      })

      return true
    } catch (error) {
      console.error('Error saving score:', error)
      return false
    }
  },

  async getTopScores(limit_num: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const q = query(
        collection(db, 'leaderboard'),
        orderBy('score', 'desc'),
        limit(limit_num)
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LeaderboardEntry[]
    } catch (error) {
      console.error('Error fetching scores:', error)
      return []
    }
  },

  async getPlayerStats(playerId: string) {
    try {
      const q = query(
        collection(db, 'leaderboard'),
        orderBy('score', 'desc')
      )

      const snapshot = await getDocs(q)
      const scores = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LeaderboardEntry[]

      const playerScores = scores.filter((s) => s.playerId === playerId)
      const totalScore = playerScores.reduce((sum, s) => sum + s.score, 0)
      const bestScore = playerScores.length > 0 ? playerScores[0].score : 0

      return {
        totalGames: playerScores.length,
        totalScore,
        bestScore,
        rank: scores.findIndex((s) => s.playerId === playerId) + 1,
      }
    } catch (error) {
      console.error('Error fetching player stats:', error)
      return null
    }
  },
}