import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAS_uhRsMto1z4yXlRnXkChbDmIb3YRrd4",
  authDomain: "emsystems-2aec9.firebaseapp.com",
  projectId: "emsystems-2aec9",
  storageBucket: "emsystems-2aec9.firebasestorage.app",
  messagingSenderId: "455001799207",
  appId: "1:455001799207:web:8dacf7ad5cfa81e74bac02"
};

// Main App (For Login)
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Secondary App (For Admin to create new users without logging out)
export const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
export const secondaryAuth = getAuth(secondaryApp);