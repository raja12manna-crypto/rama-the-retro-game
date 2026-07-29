import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoWG67evoEY5KGvO_zLVNfPbIi92u4-WU",
  authDomain: "rama-prince-of-ayodhya.firebaseapp.com",
  projectId: "rama-prince-of-ayodhya",
  storageBucket: "rama-prince-of-ayodhya.firebasestorage.app",
  messagingSenderId: "1094984654180",
  appId: "1:1094984654180:web:bf4bbd9b8589f3389fee71",
  measurementId: "G-78L8QK2DRR"
};

// Initialize Firebase at module level
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Setup persistence
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Persistence setup failed:', err)
})

// Setup offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Offline persistence: multiple tabs open')
  } else if (err.code === 'unimplemented') {
    console.warn('Offline persistence: not supported')
  }
})

// Google Provider
export const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('profile')
googleProvider.addScope('email')

// Initialize Firebase function for compatibility
export const initializeFirebase = async () => {
  return { app, auth, db }
}