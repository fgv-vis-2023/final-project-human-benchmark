// run 'npm run build' to bundle this file
import { sampleNormal, sampleScore } from './utilities.js';
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, getDocs, onSnapshot,
  addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp,
  getDoc, updateDoc, limit
} from "firebase/firestore";
import {
  getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged
} from "firebase/auth";
import * as d3 from 'd3';
import { RadarChart } from './radarChart.js';
import 'parcoord-es/dist/parcoords.css';
import ParCoords from 'parcoord-es';
import { PctBarChart } from './pctBarChart.js';

fetch("../../firebaseConfig.json")
.then(response => response.json())
.then(config => {
  // console.log(config);
  initializeApp(config);
  
const db = getFirestore();  // connect to firestore
const auth = getAuth();  // connect to auth

// const signupForm = document.querySelector('#signup');
// signupForm.addEventListener('submit', (e) => {
//   e.preventDefault()
//   var username = signupForm.username.value.toString()
//   username = username.toLowerCase().replace(RegExp(' ', "g"), '_') + "@maildrop.cc"
//   createUserWithEmailAndPassword(auth, username, signupForm.password.value)
//     .then((userCredential) => {
//       console.log('User created, welcome', userCredential.user)
//       signupForm.reset()
//     })
//     .catch((error) => {
//       alert(error.message)
//     })
// })

const logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log('User signed out')
    })
    .catch((error) => {
      alert(error.message)
    })
})

const loginForm = document.querySelector('#login');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()
  var username = loginForm.username.value.toString()
  username = username.toLowerCase().replace(RegExp(' ', "g"), '_') + "@maildrop.cc"

  signInWithEmailAndPassword(auth, username, loginForm.password.value)
    .then((userCredential) => { 
      console.log('User signed in', userCredential.user)
      loginForm.reset()
    })
    .catch((error) => {
      alert(error.message)
    })
})
})
