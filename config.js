import firebase from "firebase";
require("@firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAvbBJUpj_MvdVyvEXB_QxpWHmvigSf9Gs",
  authDomain: "barter-app-30483.firebaseapp.com",
  projectId: "barter-app-30483",
  storageBucket: "barter-app-30483.appspot.com",
  messagingSenderId: "1004479878428",
  appId: "1:1004479878428:web:26ad1fd9e5efae157656d9",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
