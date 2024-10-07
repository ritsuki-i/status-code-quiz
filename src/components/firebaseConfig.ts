// src/firebaseConfig.js
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyDw477h3JudJxrycrUd9KgljXAMHpD-tJ8",
  authDomain: "status-code-quiz-3e8cd.firebaseapp.com",
  projectId: "status-code-quiz-3e8cd",
  storageBucket: "status-code-quiz-3e8cd.appspot.com",
  messagingSenderId: "341338615577",
  appId: "1:341338615577:web:3d73593bc8e994e480df88",
  measurementId: "G-4RQTTJYNE7"
};

// Firebaseを初期化
const app: FirebaseApp = initializeApp(firebaseConfig);

// Firestoreデータベースを取得
const db: Firestore = getFirestore(app);

export { db };
