// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcA0rD2Gu30_2gWcKkS2SojYbK-pML2fc",
  authDomain: "ecofeast-2fd8b.firebaseapp.com",
  projectId: "ecofeast-2fd8b",
  storageBucket: "ecofeast-2fd8b.firebasestorage.app",
  messagingSenderId: "832097161649",
  appId: "1:832097161649:web:54a086cdad71a9a064ad90",
  measurementId: "G-74S57HNESJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);