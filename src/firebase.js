
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import{getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBxu5pkwvYYLpmgx4H2MjU_2AitTdxcKsY",
    authDomain: "login-chess-f8ac9.firebaseapp.com",
    projectId: "login-chess-f8ac9",
    storageBucket: "login-chess-f8ac9.appspot.com",
    messagingSenderId: "704322005920",
    appId: "1:704322005920:web:d0596c1c4080e86da592c5",
    measurementId: "G-B8R9G97J08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;