// Firebase Configuration
// Replace these values with your Firebase project config
// Get these from: Firebase Console > Project Settings > General > Your apps

export const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL || "https://demo-project-default-rtdb.firebaseio.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VITE_FIREBASE_APP_ID || "demo-app-id"
};

// Check if Firebase is properly configured
export const isFirebaseConfigured = () => {
  return !firebaseConfig.apiKey.includes('demo') &&
         !firebaseConfig.projectId.includes('demo') &&
         firebaseConfig.apiKey !== "demo-api-key";
};