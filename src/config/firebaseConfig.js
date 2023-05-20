/**
 * Firebase Configuration
 * Contains Firebase configuration details and exports Firebase app and Firestore functions
 */

// Import Firebase functions
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, query, where,updateDoc } from 'firebase/firestore';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firestore instance
export const db = getFirestore(app);

// Export Firestore functions
export { collection, getDocs, addDoc, doc, deleteDoc, query, where ,updateDoc};