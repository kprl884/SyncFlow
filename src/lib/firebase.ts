import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

// Providers
const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

export { app, auth, db, googleProvider, microsoftProvider };