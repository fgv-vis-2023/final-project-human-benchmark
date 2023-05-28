// run 'npm run build' to bundle this file
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, getDocs, onSnapshot,
  addDoc, deleteDoc, doc, query, where
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBJnXNrYtlXC-DybP5MAJZXuYKHqcczpoE",
    authDomain: "mind-track-778eb.firebaseapp.com",
    projectId: "mind-track-778eb",
    storageBucket: "mind-track-778eb.appspot.com",
    messagingSenderId: "960246747563",
    appId: "1:960246747563:web:f659460f312b7fd89b42ee"
  };

initializeApp(firebaseConfig);

const db = getFirestore();  // connect to firestore

const colRef = collection(db, 'tests');  // connect to collection 'users'

const q = query(colRef, where("Game 1 Score", ">", 50))  // make queries

// gets snapshot on page load
// getDocs(colRef)
//   .then((snapshot) => {
//     let userscores = []
//     snapshot.docs.forEach((doc) => {
//       userscores.push({ id: doc.id, ...doc.data()})  // push the data of each document to the array, the three dots are the spread operator
//     })
//     console.log(userscores)
//   })
//   .catch((error) => {
//     console.log(error.message)
//   })

// gets snapshot in real time
onSnapshot(colRef, (snapshot) => {let userscores = []
  snapshot.docs.forEach((doc) => {
    userscores.push({ id: doc.id, ...doc.data()})  // push the data of each document to the array, the three dots are the spread operator
  })
  console.log(userscores)
})

onSnapshot(q, (snapshot) => {let userscores = []
  snapshot.docs.forEach((doc) => {
    userscores.push({ id: doc.id, ...doc.data()})  // push the data of each document to the array, the three dots are the spread operator
  })
  console.log(userscores)
})


const sendData = document.querySelector('.add');
sendData.addEventListener('submit', (e) => {
  e.preventDefault()  // stops page from reloading

  addDoc(colRef, {
    Username: sendData.Username.value,
    "Game 1 Score": sendData["Game 1 Score"].value,
    "Game 2 Score": sendData["Game 2 Score"].value,
    "Game 3 Score": sendData["Game 3 Score"].value,
    "Game 4 Score": sendData["Game 4 Score"].value,
    "Game 5 Score": sendData["Game 5 Score"].value,
  })
  .then(() => {
    sendData.reset()
  })
})

const delData = document.querySelector('.delete');
delData.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'tests', delData.id.value)

  deleteDoc(docRef)
  .then(() => {
    delData.reset()
  })

})