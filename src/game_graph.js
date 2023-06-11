// run 'npm run build' to bundle this file
import { sampleNormal, sampleScore, getPercentage } from './utilities.js';
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
import { histogramChart } from './histogramChart.js';

fetch("./firebaseConfig.json")
  .then(response => response.json())
  .then(config => {
    // console.log(config);
    initializeApp(config);


const db = getFirestore();  // connect to firestore
const auth = getAuth();  // connect to auth

const logoutButton = document.querySelector('#logout');
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log('User signed out')
    })
    .catch((error) => {
      alert(error.message)
    })
})

// const percentis = collection(db, 'percentis')
// const pctScores = {}
// getDocs(percentis).then((snapshot) => {
//   snapshot.docs.forEach((doc) => {
//     pctScores[doc.id] = doc.data()
//   })
// })

var game = "atencao"

var useremail = ""
onAuthStateChanged(auth, (user) => {
  if (user === null) {
    useremail = "laguardia42@maildrop.cc"  // default user
  } else {
    useremail = auth.currentUser.email
  }
  
  const scores = collection(db, 'jogos');  // connect to specific game collection
  // const qScores = query(scores, limit(5), orderBy('dia', 'desc'), where("email", "==", useremail))
  console.log(useremail)

  onSnapshot(scores, (snapshot) => {
    let userscores = []
    let best_score = 0
    let avg_score = 0
    let recent_score = 0
    let recent_date = 0
    let count = 0
    let test = []

    snapshot.docs.forEach((doc) => {
      const docdata = doc.data()
      userscores.push(docdata)
      if (docdata["email"] === useremail) {
        test.push(docdata)
        if (docdata[game] > best_score) {
          best_score = docdata[game]
        }
        avg_score += docdata[game]
        count += 1
        if (docdata["dia"] > recent_date) {
          recent_date = docdata["dia"]
          recent_score = docdata[game]
        }
      }
    })
    avg_score = avg_score / count
    histogramChart(".histogram",userscores, best_score)
  });
})
})