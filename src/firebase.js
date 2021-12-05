import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA5Spz36mGStzNBq7KVLWashv20-ZPkh5E",
  authDomain: "reels-clone-48327.firebaseapp.com",
  projectId: "reels-clone-48327",
  storageBucket: "reels-clone-48327.appspot.com",
  messagingSenderId: "546204083816",
  appId: "1:546204083816:web:d77cd6a9990caddc6d7ddd",
  measurementId: "G-WSSJXTJ42F"
};


firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const database = {
    users: firestore.collection('users'),
    posts : firestore.collection('posts'),
    comments : firestore.collection('comments'),
    getTimeStamp: firebase.firestore.FieldValue.serverTimestamp,
}

export const storage = firebase.storage();