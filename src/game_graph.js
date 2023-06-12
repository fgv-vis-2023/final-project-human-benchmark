// run 'npm run build' to bundle this file
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
import 'parcoord-es/dist/parcoords.css';
import { histogramChart } from './histogramChart.js';
import { temporalChart } from './temporalChart.js';

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

const colors = {
  "atencao": ["#ef9797", "#B71C1C"],
  "coordenacao": ["#b384ed", "#4A148C"],
  "memoria": ["#74bb79", "#1B5E20"],
  "percepcao": ["#feb68f", "#E65100"],
  "raciocinio": ["#72c0fe", "#01579B"]
}

// const percentis = collection(db, 'percentis')
// const pctScores = {}
// getDocs(percentis).then((snapshot) => {
//   snapshot.docs.forEach((doc) => {
//     pctScores[doc.id] = doc.data()
//   })
// })

var pageLogic = function (game) {
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
      let specificuserscores = []

      snapshot.docs.forEach((doc) => {
        let docdata = doc.data()
        docdata["dia"] = docdata["dia"].toDate()
        if (docdata["email"] === useremail) {
          if (docdata[game] > best_score) {
            best_score = docdata[game]
          }
          avg_score += docdata[game]
          count += 1
          if (docdata["dia"] > recent_date) {
            recent_date = docdata["dia"]
            recent_score = docdata[game]
          }
          specificuserscores.push(docdata)
        }
        userscores.push(docdata)
      })
      avg_score = Math.round(avg_score*100 / count)/100
      d3.select(".histogram").select("svg").remove();
      histogramChart(".histogram", userscores, {"best": best_score, "avg": avg_score, "recent": recent_score}, {"color": colors[game], "game": game})

      userscores.sort(  // sort by date
        function(a, b) {
          return a["dia"] - b["dia"]
        })

      temporalChart(".temporalChart", specificuserscores, userscores, {"color": colors[game], "game": game})
    });
  })
}


var select = document.getElementById('test-select');
pageLogic(select.value)
var game = select.options[select.selectedIndex].value;
select.addEventListener('change', function(event) {
  game = event.target.value;
  pageLogic(game)
})
})