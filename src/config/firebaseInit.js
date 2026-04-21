import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";
import firebaseConfig from "./firebaseConfig";

// Initialize Firebase once globally
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
