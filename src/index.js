// run 'npm run build' to bundle this file
import { sampleNormal, sampleScore } from './sampling.js';
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

const firebaseConfig = {
  apiKey: "AIzaSyAc5E-QFXg4gyG6vYn40nmED2NzVArJ8tI",
  authDomain: "mindtrack-42.firebaseapp.com",
  projectId: "mindtrack-42",
  storageBucket: "mindtrack-42.appspot.com",
  messagingSenderId: "291274752534",
  appId: "1:291274752534:web:b91f4b1d4a7b6097c3eb37",
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
    Username: auth.currentUser.email,
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
      alert(error.message)
    })
})

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

const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  signInWithEmailAndPassword(auth, loginForm.email.value, loginForm.password.value)
    .then((userCredential) => { 
      console.log('User signed in', userCredential.user)
      loginForm.reset()
    })
    .catch((error) => {
      alert(error.message)
    })
})

// const generate = document.querySelector('.generate');
// generate.addEventListener('click', () => {
//   // function that generates 100 random usernames, with scores for each game
//   const colRef = collection(db, 'mock');  // connect to collection 'users'
//   for (let i = 0; i < 10; i++) {
//     let score1 = sampleScore(60, 15)
//     let score2 = sampleScore(50, 20)
//     let score3 = sampleScore(55, 25)
//     let score4 = sampleScore(75, 10)
//     let score5 = sampleScore(80, 20)
//     for (let j = 0; j < 10; j++) {
//       addDoc(colRef, {
//         usuario: "user" + i + "@gmail.com",
//         jogo1: Math.min(~~(score1 + j*sampleNormal(1, 0.7)), 100),
//         jogo2: Math.min(~~(score2 + j*sampleNormal(1.5, 1)), 100),
//         jogo3: Math.min(~~(score3 + j*sampleNormal(1.2, 0.7)), 100),
//         jogo4: Math.min(~~(score4 + j*sampleNormal(0.5, 0.5)), 100),
//         jogo5: Math.min(~~(score5 + j*sampleNormal(0.5, 0.5)), 100),
//         dia: serverTimestamp(),
//         sono: ~~sampleScore(7, 1.5),
//         exercicio: ~~sampleScore(1, 2),
//         emocao: ~~sampleScore(3, 2)
//       })
//     }
//   }
// })

// logic to get scores of a specific user in a game
const userquery = document.querySelector('.consult');
userquery.addEventListener('submit', (e) => {
  e.preventDefault()
  const scores = collection(db, 'mock');  // connect to specific game collection 
  
  const qScores = query(scores, 
                        where("usuario", "==", userquery.email.value))  // make queries
  
  onSnapshot(qScores, (snapshot) => {
    let userscores = []
    snapshot.docs.forEach((doc) => {
      userscores.push({"score": doc.data()[`jogo${userquery.gameid.value}`],
                        // "jogo2": doc.data().jogo2,
                        // "jogo3": doc.data().jogo3,
                        // "jogo4": doc.data().jogo4,
                        // "jogo5": doc.data().jogo5,
                        "emocao": doc.data().emocao,
                        "exercicio": doc.data().exercicio,
                        "sono": doc.data().sono, 
                        "dia": doc.data().dia})
                      })
                      userscores = userscores.sort(function(a, b){
                        if (a.dia > b.dia) {return 1}
                        return -1
                      })
                      console.log(userscores)
                    })
                  })
                  
// Radial graph


var radarmargin = {top: 100, right: 100, bottom: 100, left: 100},
radarwidth = Math.min(700, window.innerWidth - 10) - radarmargin.left - radarmargin.right,
radarheight = Math.min(radarwidth, window.innerHeight - radarmargin.top - radarmargin.bottom - 20);

var colorRange = ['#94003a', '#ae3e52', '#c9676c', '#e28d87', '#fbb4a2'].reverse();

var radarChartOptions = {
  w: radarwidth,
  h: radarheight, 
  margin: radarmargin,
  maxValue: 0.5,
  levels: 5,
  roundStrokes: true,
  color: d3.scaleOrdinal().range(colorRange),
  opacityArea: 0,
  strokeWidth: 2,
  dotRadius: 4,
};

var useremail = ""
onAuthStateChanged(auth, (user) => {
  if (user === null) {
    useremail = "user8@gmail.com"  // default user
  } else {
    useremail = auth.currentUser.email
  }
  
  const scores = collection(db, 'mock');  // connect to specific game collection
  // const qScores = query(scores, limit(5), orderBy('dia', 'desc'), where("usuario", "==", useremail))
  const qScores = query(scores, limit(5), orderBy('dia', 'desc'), where("usuario", "==", useremail))
  console.log(useremail)
  
  let radialGraph = onSnapshot(qScores, (snapshot) => {
    let userscores = []
    snapshot.docs.forEach((doc, i) => {
      userscores.push({"key": "Day "+(5-i).toString(), "values": [
        {axis: "Test 1 Score", value: Math.max(doc.data().jogo1*0.01, 0), areaName: "Day "+(5-i).toString(), index: i},
        {axis: "Test 2 Score", value: Math.max(doc.data().jogo2*0.01, 0), areaName: "Day "+(5-i).toString(), index: i},
        {axis: "Test 3 Score", value: Math.max(doc.data().jogo3*0.01, 0), areaName: "Day "+(5-i).toString(), index: i},
        {axis: "Test 4 Score", value: Math.max(doc.data().jogo4*0.01, 0), areaName: "Day "+(5-i).toString(), index: i},
        {axis: "Test 5 Score", value: Math.max(doc.data().jogo5*0.01, 0), areaName: "Day "+(5-i).toString(), index: i}
      ]})
  })
    let userscores_inv = userscores.reverse()
    // userscores = userscores.map((doc) => doc.slice(1, 6))
    const data = snapshot.docs.map((doc) => doc.data());
  
    //Call function to draw the Radar chart
    RadarChart(".radarChart", userscores, radarChartOptions);

    var mostRecent = []

    userscores[0].values.forEach((d, i) => {
      mostRecent.push({Game: d.axis, Score: d.value*100})
    })

    PctBarChart(".pctBarChart", mostRecent);
  });
  radialGraph;

  // Parallel coordinates graph
  const pQuery = query(scores, orderBy('dia', 'asc'))
  
  var parmargin = {top: 50, right: 50, bottom: 50, left: 100},
  parwidth = Math.min(1000, window.innerWidth - 10) - parmargin.left - parmargin.right,
  parheight = Math.min(300, window.innerHeight - parmargin.top - parmargin.bottom - 20);
  
  var parcoord = d3.select(".parcoords")
  .style("width",  parwidth + parmargin.left + parmargin.right + "px")
  .style("height", parheight + parmargin.top + parmargin.bottom + "px")
  
  var dimensions = {
    "Test 1 Score": {type:"number"},
    "Test 2 Score": {type:"number"},
    "Test 3 Score": {type:"number"},
    "Test 4 Score": {type:"number"},
    "Test 5 Score": {type:"number"}};
  
  let parallelGraph = onSnapshot(pQuery, (snapshot) => {
    var object = {}
    // for each user, get their most recent score
    snapshot.docs.forEach((doc, i) => {
      object[doc.data().usuario] = {
      "Test 1 Score": Math.max(doc.data().jogo1*0.01, 0),
      "Test 2 Score": Math.max(doc.data().jogo2*0.01, 0),
      "Test 3 Score": Math.max(doc.data().jogo3*0.01, 0),
      "Test 4 Score": Math.max(doc.data().jogo4*0.01, 0),
      "Test 5 Score": Math.max(doc.data().jogo5*0.01, 0),
      "key": doc.data().usuario}
    })
    // flatten object
    var userscores = []
    Object.values(object).forEach(doc => {
      userscores.push({"Usuario": doc.key, 
                       "Test 1 Score": doc["Test 1 Score"],
                       "Test 2 Score": doc["Test 2 Score"],
                       "Test 3 Score": doc["Test 3 Score"],
                       "Test 4 Score": doc["Test 4 Score"],
                       "Test 5 Score": doc["Test 5 Score"]})
    })
    console.log(userscores)
  
    var pc2 = ParCoords()(".parcoords");
    pc2
      .data(userscores)
      .dimensions(dimensions)
      .color(function(d) {
        if (d.Usuario.toLowerCase() === useremail)
            return colorRange.slice(-1);
        else
            return "#000";
    })
      .alpha(0.6)
      .margin(parmargin)
      .render()
      .reorderable()
      .brushMode("1D-axes")  // enable brushing;
      .mark(userscores.filter(d => d.Usuario.toLowerCase() === useremail))
  })
})


// Parallel coordinates
