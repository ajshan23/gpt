// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getDatabase} from "firebase/database"
import { getAnalytics } from "firebase/analytics";

import { getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhzEQi1-fT5_rtpHdEuVKUpSKcTdeq7sQ",
  authDomain: "evee-90c0c.firebaseapp.com",
  projectId: "evee-90c0c",
  storageBucket: "evee-90c0c.appspot.com",
  messagingSenderId: "523870396766",
  appId: "1:523870396766:web:34d440f7b3657dda606fcf",
  measurementId: "G-J1MP2Z4WDT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db=getFirestore(app)
export const auth=getAuth()



export default app