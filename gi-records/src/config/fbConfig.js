import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage';


// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCbmjFr2C8Yca0zVsx1rcfoTLCahNNFFHg",
  authDomain: "gi-records-userdata.firebaseapp.com",
  databaseURL: "https://gi-records-userdata.firebaseio.com",
  projectId: "gi-records-userdata",
  storageBucket: "gi-records-userdata.appspot.com",
  messagingSenderId: "357086318287",
  appId: "1:357086318287:web:081998d91e99d4b80631ba",
  measurementId: "G-J906PYE2BQ"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export const db = firebase.firestore()
  export const storage = firebase.storage()

  export default firebase