import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCzzpeUm7LvwHHWf-WPurqyan12I_PHok0",
  authDomain: "ptvschool2026.firebaseapp.com",
  projectId: "ptvschool2026",
  storageBucket: "ptvschool2026.firebasestorage.app",
  messagingSenderId: "951971479327",
  appId: "1:951971479327:web:143d69d4f992f105987a2a",
  measurementId: "G-96K10KBXJX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);