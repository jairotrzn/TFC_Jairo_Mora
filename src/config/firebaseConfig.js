import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  query,
  where,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { getStorage, ref, uploadBytes,getDownloadURL } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCzINjRSups8Gg7D_nevFSuFZaJwQedja0",
  authDomain: "mantenimientotubalcain.firebaseapp.com",
  projectId: "mantenimientotubalcain",
  storageBucket: "mantenimientotubalcain.appspot.com",
  messagingSenderId: "728316291794",
  appId: "1:728316291794:web:70890d38844acc36745b0b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const db = getFirestore(app);
export {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  query,
  where,
  updateDoc,
  onSnapshot,
};
export { getStorage, ref, uploadBytes,getDownloadURL }
export { auth, signInWithEmailAndPassword, onAuthStateChanged, signOut };
