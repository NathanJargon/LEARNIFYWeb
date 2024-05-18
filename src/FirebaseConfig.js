import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA9FLfGFkFw8BGPJV57bfk6HHndhMe23f4",
  authDomain: "learnify-b1cca.firebaseapp.com",
  projectId: "learnify-b1cca",
  storageBucket: "learnify-b1cca.appspot.com",
  messagingSenderId: "747162614416",
  appId: "1:747162614416:web:8ee5ef5a22a5cce5def615",
  measurementId: "G-X19F7R7XXF"
};

if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}


export { firebase };