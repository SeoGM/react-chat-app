// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import "firebase/auth";
import "firebase/database";
import "firebase/storage"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQVJTwzAJwleLDejlhIUemb1_9TLmDGU0",
  authDomain: "react-chat-app-3362a.firebaseapp.com",
  projectId: "react-chat-app-3362a",
  storageBucket: "react-chat-app-3362a.appspot.com",
  messagingSenderId: "619435136334",
  appId: "1:619435136334:web:aed76e15642b4cc8457a1f",
  measurementId: "G-BE30Z572VP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;