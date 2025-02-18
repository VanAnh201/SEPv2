// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBl_HJbY7eu6PdCKBqREdBLgEA2s0GYrg4",
  authDomain: "thaco-3149c.firebaseapp.com",
  projectId: "thaco-3149c",
  storageBucket: "thaco-3149c.appspot.com",
  messagingSenderId: "236815390343",
  appId: "1:236815390343:web:0ec85a236ea9c379dfca22",
  measurementId: "G-HXLF5G7Q6B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };