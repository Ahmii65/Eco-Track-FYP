import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  // @ts-ignore
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAnjOzchfLRuKCZ9JUxZht5HAv71w2_MAQ",
  authDomain: "eco-track-8ba66.firebaseapp.com",
  projectId: "eco-track-8ba66",
  storageBucket: "eco-track-8ba66.firebasestorage.app",
  messagingSenderId: "817082889451",
  appId: "1:817082889451:web:a0b0bff01d3f1d8f1dfaae",
  measurementId: "G-24Y9S5KLXL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// db
export const fireStore = getFirestore(app);
