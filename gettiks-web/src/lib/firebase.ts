import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';
import { getFunctions } from 'firebase/functions';

const isBrowser = typeof window !== 'undefined';

const firebaseConfig = isBrowser
  ? {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    }
  : undefined;

export const firebaseApp = isBrowser
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig as any))
  : (undefined as any);
export const auth = isBrowser ? getAuth(firebaseApp) : (undefined as any);
export const db = isBrowser ? getFirestore(firebaseApp) : (undefined as any);
export const storage = isBrowser ? getStorage(firebaseApp) : (undefined as any);
export const functions = isBrowser ? getFunctions(firebaseApp) : (undefined as any);
export const googleProvider = isBrowser ? new GoogleAuthProvider() : (undefined as any);
export const facebookProvider = isBrowser ? new FacebookAuthProvider() : (undefined as any);
export const messaging = isBrowser ? (async () => (await isSupported()) ? getMessaging(firebaseApp) : undefined)() : undefined;

