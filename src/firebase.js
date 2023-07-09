import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
firebase.initializeApp({
  apiKey: "AIzaSyBSP750ZSwc0F9pLVA-RJyFgI-bulETbgc",
  authDomain: "gabutroom-a77b9.firebaseapp.com",
  databaseURL: "https://gabutroom-a77b9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gabutroom-a77b9",
  storageBucket: "gabutroom-a77b9.appspot.com",
  messagingSenderId: "360226915849",
  appId: "1:360226915849:web:7576aa688abb3a1ba35ad8",
  measurementId: "G-GEK1EGJEJ8"
});
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export { firebase, auth, firestore, storage };
