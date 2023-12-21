

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDoc, getDocs, addDoc, doc, deleteDoc, query, where, updateDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, refFromURL  } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCzINjRSups8Gg7D_nevFSuFZaJwQedja0",
  authDomain: "mantenimientotubalcain.firebaseapp.com",
  projectId: "mantenimientotubalcain",
  storageBucket: "mantenimientotubalcain.appspot.com",
  messagingSenderId: "728316291794",
  appId: "1:728316291794:web:70890d38844acc36745b0b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db,auth, storage };
export { collection, getDoc, getDocs, addDoc, doc, deleteDoc, query, where, updateDoc, onSnapshot };
export { signInWithEmailAndPassword, onAuthStateChanged, signOut };
export { ref, uploadBytes, getDownloadURL, deleteObject, refFromURL  };

