// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
// Optional:
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2Jm4uQW9OGQdAV-uF3V8X9SKA_9IJA8Y",
  authDomain: "jsi13-project.firebaseapp.com",
  projectId: "jsi13-project",
  storageBucket: "jsi13-project.firebasestorage.app",
  messagingSenderId: "45345146490",
  appId: "1:45345146490:web:f58fe49927b1a68e4d9dc3",
  measurementId: "G-19HSMYGV44",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// export { auth };
// const analytics = getAnalytics(app);
export { app, auth, db };