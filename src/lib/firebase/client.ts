import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

let appInstance: FirebaseApp | null = null
let authInstance: Auth | null = null
let firestoreInstance: Firestore | null = null
let storageInstance: FirebaseStorage | null = null

export function getFirebaseApp(): FirebaseApp {
  if (typeof window === 'undefined') {
    throw new Error('Firebase app should be initialized client-side only')
  }
  if (!appInstance) {
    appInstance = getApps().length ? getApp() : initializeApp(firebaseConfig)
  }
  return appInstance
}

export function getAuthClient(): Auth {
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp())
  }
  return authInstance
}

export function getFirestoreClient(): Firestore {
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(getFirebaseApp())
  }
  return firestoreInstance
}

export function getStorageClient(): FirebaseStorage {
  if (!storageInstance) {
    storageInstance = getStorage(getFirebaseApp())
  }
  return storageInstance
}

export const googleProvider = new GoogleAuthProvider()

