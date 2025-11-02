// Firebase Configuration for MESA Website
// Replace with your actual Firebase config after creating project

const firebaseConfig = {
  // You'll get these values from Firebase Console after creating project
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "mesa-website.firebaseapp.com",
  projectId: "mesa-website",
  storageBucket: "mesa-website.appspot.com",
  messagingSenderId: "123456789",
  appId: "YOUR_APP_ID_HERE"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// MESA specific configuration
export const MESA_CONFIG = {
  adminEmail: "admin-mesa@iitpkd.ac.in",
  allowedDomain: "@smail.iitpkd.ac.in",
  collections: {
    events: "events",
    members: "members",
    joinRequests: "joinRequests"
  }
};

console.log("Firebase initialized for MESA website");
