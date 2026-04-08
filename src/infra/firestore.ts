// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDOlt6FIvBkbxSu5s9199fIiiIgUlq6ObQ",
	authDomain: "shopping-list-5758e.firebaseapp.com",
	projectId: "shopping-list-5758e",
	storageBucket: "shopping-list-5758e.firebasestorage.app",
	messagingSenderId: "880124493488",
	appId: "1:880124493488:web:d0023b09f8026b533e0575",
	measurementId: "G-BRRE2N5ZHK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
