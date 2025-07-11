// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-83de3.firebaseapp.com",
  projectId: "mern-estate-83de3",
  storageBucket: "mern-estate-83de3.firebasestorage.app",
  messagingSenderId: "1075847412883",
  appId: "1:1075847412883:web:a01a002d9e33c0468f2166"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);