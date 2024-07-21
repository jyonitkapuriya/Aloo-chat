import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDx0Q62edTCPKyY7vwdSieGqiAd6xzOdss",
    authDomain: "aaloo-chat-79e26.firebaseapp.com",
    projectId: "aaloo-chat-79e26",
    storageBucket: "aaloo-chat-79e26.appspot.com",
    messagingSenderId: "361978708048",
    appId: "1:361978708048:web:7a97e6ad0ce5de00dfd155",
    measurementId: "G-RHC6VGRYT7"
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const analytics = app.name && typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const useAuth = getAuth;
export const db = getFirestore(app);

// export const storage = getStorage;
// const Firestore = getFirestore();



