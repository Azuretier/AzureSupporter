import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Singleton pattern - Firebase handles initialization safety internally
// getApps() is thread-safe and prevents duplicate initialization
let db: Firestore | null = null;

export function initializeFirebase() {
  // Check if Firebase is already initialized
  const existingApps = getApps();
  const app = existingApps.length === 0 ? initializeApp(firebaseConfig) : existingApps[0];
  
  if (!db) {
    db = getFirestore(app);
  }
  
  return { app, db };
}

// Get Firestore instance (lazy initialization)
export function getDb(): Firestore {
  if (!db) {
    const { db: database } = initializeFirebase();
    return database;
  }
  return db;
}
