import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, updateDoc, increment, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3CwNB2h9dFW84BosRFI7NCCJp3ryVs5I",
  authDomain: "qr-code-maker-1.firebaseapp.com",
  projectId: "qr-code-maker-1",
  storageBucket: "qr-code-maker-1.firebasestorage.app",
  messagingSenderId: "116092035124",
  appId: "1:116092035124:web:1e753f8b90e4a6f7f1ea61"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, doc, updateDoc, increment, getDoc, setDoc, onSnapshot }; 