import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEr55xVNT2kSJUSs6RPT7fbwPVnNRDuFA",
  authDomain: "plusultra-865dc.firebaseapp.com",
  databaseURL: "https://plusultra-865dc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "plusultra-865dc",
  storageBucket: "plusultra-865dc.firebasestorage.app",
  messagingSenderId: "663312053578",
  appId: "1:663312053578:web:0c466ef4650fabeb6fbdb3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;