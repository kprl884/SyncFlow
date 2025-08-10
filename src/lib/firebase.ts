import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from "firebase/firestore";

// Firebase project configuration for syncflow-app
const firebaseConfig = {
  apiKey: "AIzaSyDlV-qn3NbeTNMGzmVYxAIgwWh0rDVRCKA",
  authDomain: "syncflow-app.firebaseapp.com",
  projectId: "syncflow-app",
  storageBucket: "syncflow-app.firebasestorage.app",
  messagingSenderId: "409463519173",
  appId: "1:409463519173:web:b94225687af9bece1c7dac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence and network handling
enableNetwork(db).catch(console.error);

// Network status monitoring
let isOnline = navigator.onLine;

window.addEventListener('online', () => {
  isOnline = true;
  console.log('Network: Online');
  enableNetwork(db).catch(console.error);
});

window.addEventListener('offline', () => {
  isOnline = false;
  console.log('Network: Offline');
  disableNetwork(db).catch(console.error);
});

// Providers
const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

// Add scopes for better user experience
googleProvider.addScope('email');
googleProvider.addScope('profile');

export { app, auth, db, googleProvider, microsoftProvider, isOnline };