// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: "mern-estate-55f32.firebaseapp.com",
    projectId: "mern-estate-55f32",
    storageBucket: "mern-estate-55f32.appspot.com",
    messagingSenderId: "837727433957",
    appId: "1:837727433957:web:a63799fa1e222ddd7c500c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
