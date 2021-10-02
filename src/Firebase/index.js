import firebase from "firebase/app";
import "firebase/storage";
import "firebase/database";
import "firebase/auth";
import "firebase/messaging";
import "firebase/analytics";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBw2Y7mHTTARE95QIw19mEzPNKq7cssENk",
  authDomain: "whatsapp-app-2016f.firebaseapp.com",
  projectId: "whatsapp-app-2016f",
  storageBucket: "whatsapp-app-2016f.appspot.com",
  messagingSenderId: "428817069430",
  appId: "1:428817069430:web:5206bf82b2f84db71ff657",
  measurementId: "G-MTFGRSSSKQ",
  databaseURL:
    "https://whatsapp-app-2016f-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const storage = firebase.storage();
const database = firebase.database();
const auth = firebase.auth();
const firestore = firebase.firestore();

export { firestore, auth, database, storage, firebase as default };
