import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 
import { getAnalytics } from "firebase/analytics";
 
const firebaseConfig = {
  apiKey: "AIzaSyDOyKpqu1tYN_0-RHw91xmqBCdrxMSQZo4",
  authDomain: "wr-distrib.firebaseapp.com",
  projectId: "wr-distrib",
  storageBucket: "wr-distrib.firebasestorage.app",
  messagingSenderId: "895616181909",
  appId: "1:895616181909:web:06ed4edac39bbd857b5d9c",
  measurementId: "G-XW9JN00JNH"
};
 
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp(); 
const db = getFirestore(app); 
const auth = getAuth(app);
const analytics = getAnalytics(app); 
export { db, auth };
