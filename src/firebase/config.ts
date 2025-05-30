import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// For production, these values should be set in environment variables
const firebaseConfig = {
  apiKey: "AIzaSyDMbLIyDK_Yq_3EiceqxNfh9cW6LuNtefo",
  authDomain: "expensestrac-220a3.firebaseapp.com",
  projectId: "expensestrac-220a3",
  storageBucket: "expensestrac-220a3.firebasestorage.app",
  messagingSenderId: "327767081671",
  appId: "1:327767081671:web:c939dbe3400bb4591bb4e2",
  measurementId: "G-298YY39EYE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;