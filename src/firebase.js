import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCqit3F3lpFmuZJg5bNPf-y3kc8JyJC44s",
    authDomain: "drive-2024-r.firebaseapp.com",
    projectId: "drive-2024-r",
    storageBucket: "drive-2024-r.appspot.com",
    messagingSenderId: "701046536915",
    appId: "1:701046536915:web:33db15cc6b3750c3583226",
    measurementId: "G-TVF0660FFD"
};

const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, storage, auth, provider };