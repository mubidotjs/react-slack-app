import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyD_zsAprjYce8tmrkTJQ5nMHDuFS0uUygM",
    authDomain: "reactjs-slack-app.firebaseapp.com",
    projectId: "reactjs-slack-app",
    storageBucket: "reactjs-slack-app.appspot.com",
    messagingSenderId: "266213178786",
    appId: "1:266213178786:web:58ad8bb0e101cee0b206fb",
    measurementId: "G-NMWX0ZYY0H"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;