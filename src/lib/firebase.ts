import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "studio-3597331857-d1b09",
  appId: "1:753812883631:web:09219f53b79f7aef2bac5a",
  storageBucket: "studio-3597331857-d1b09.firebasestorage.app",
  apiKey: "AIzaSyDk3TRap2WbgCHFZsiV_y4ysX8pQZjqqsQ",
  authDomain: "studio-3597331857-d1b09.firebaseapp.com",
  messagingSenderId: "753812883631"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
