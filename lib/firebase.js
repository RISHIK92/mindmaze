import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCl-7NwT3EcENYpu86BF8YATb8PtO2Ycts",
  authDomain: "mindmaze-69e01.firebaseapp.com",
  projectId: "mindmaze-69e01",
  storageBucket: "mindmaze-69e01.firebasestorage.app",
  messagingSenderId: "14804283182",
  appId: "1:14804283182:web:61dc03b3d5b4932a9b14bf",
  measurementId: "G-G8BSG600ZZ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);
export { app, auth };
