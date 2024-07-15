// src/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCl6fFUXJ_nQCZDqAnDaArvyqKn_Sqh660",
    authDomain: "chatapp-next-real.firebaseapp.com",
    databaseURL: "https://chatapp-next-real-default-rtdb.firebaseio.com",
    projectId: "chatapp-next-real",
    storageBucket: "chatapp-next-real.appspot.com",
    messagingSenderId: "723403646632",
    appId: "1:723403646632:web:be0f02eb82fda2d299849d",
    measurementId: "G-B26LX89C47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
