

import { initializeApp } from 'firebase/app';
import { getFirestore,collection, getDocs,addDoc,doc,deleteDoc,query,where,updateDoc} from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged,projectAuth  } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNc7UgKKvFKhFliYc5cwFN09QJeqTjj48",
  authDomain: "calendariomantenimiento-d401a.firebaseapp.com",
  projectId: "calendariomantenimiento-d401a",
  storageBucket: "calendariomantenimiento-d401a.appspot.com",
  messagingSenderId: "966712255259",
  appId: "1:966712255259:web:3baf9b6f4d3174f11669be"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

 export const db = getFirestore(app);
 export {collection,getDocs,addDoc,doc,deleteDoc,query,where,updateDoc}
 export{app,auth,signInWithEmailAndPassword,onAuthStateChanged }

