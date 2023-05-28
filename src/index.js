// run 'npm run build' to bundle this file
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, getDocs, onSnapshot,
  addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp,
  getDoc, updateDoc
} from "firebase/firestore";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
} from "firebase/auth";

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
const auth = getAuth();  // connect to auth

const colRef = collection(db, 'tests');  // connect to collection 'users'

// const q = query(colRef, where("Game 3 Score", ">", 20), orderBy('Game 3 Score', 'asc'))  // make queries

const q = query(colRef, orderBy('createdAt', 'asc'))

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


// gets snapshot of a query every time the database changes
onSnapshot(q, (snapshot) => {let userscores = []
  snapshot.docs.forEach((doc) => {
    userscores.push({ id: doc.id, ...doc.data()})  // push the data of each document to the array, the three dots are the spread operator
  })
  console.log(userscores)
})

// add a document
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
    createdAt: serverTimestamp(),
  })
  .then(() => {
    sendData.reset()
  })
})

// delete a specific document
const delData = document.querySelector('.delete');
delData.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'tests', delData.id.value)

  deleteDoc(docRef)
  .then(() => {
    delData.reset()
  })
})

// get a single specific document
const docRef = doc(db, 'tests', 'mgrHldHkenr52jbhK1po');

onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id)
})

// update a specific document
const updateData = document.querySelector('.update');

updateData.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'tests', updateData.id.value)
  // uses docRef to get the document, checks its fields, then checks if the field to be updated is already present
  getDoc(docRef)
    .then((doc) => {
    const keys = Object.keys(doc.data())
    if (keys.includes(updateData.field.value)) {
      updateDoc(docRef, {
        [updateData.field.value]: updateData.value.value
      })
    }
    else {
      console.log('invalid field')
    }
  })
})

// authentication
const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  createUserWithEmailAndPassword(auth, signupForm.email.value, signupForm.password.value)
    .then((userCredential) => {
      console.log('User created, welcome', userCredential.user)
      signupForm.reset()
    })
    .catch((error) => {
      console.log(error.message)
    })

})