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

const percentis = collection(db, 'percentis')
const pctScores = {}
getDocs(percentis).then((snapshot) => {
  snapshot.docs.forEach((doc) => {
    pctScores[doc.id] = doc.data()
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
  opacityArea: 0,
  strokeWidth: 2,
  dotRadius: 4,
  maxValue: 1
};

var useremail = ""
onAuthStateChanged(auth, (user) => {
  if (user === null) {
    useremail = "laguardia42@maildrop.cc"  // default user
  } else {
    useremail = auth.currentUser.email
  }
  
  const scores = collection(db, 'jogos');  // connect to specific game collection
  // const qScores = query(scores, limit(5), orderBy('dia', 'desc'), where("email", "==", useremail))
  const qScores = query(scores, limit(5), orderBy('dia', 'desc'), where("email", "==", useremail))
  console.log(useremail)
  
  let radialGraph = onSnapshot(qScores, (snapshot) => {
    let userscores = []
    snapshot.docs.forEach((doc, i) => {
      var day = doc.data().dia.toDate().toLocaleDateString()
      console.log(doc.data(), day)
      userscores.push({"key": day, "values": [
        {axis: "Attention", value: getPercentage(doc.data().atencao, pctScores["atencao"]), areaName: day, index: i},
        {axis: "Coordination", value: getPercentage(doc.data().coordenacao, pctScores["coordenacao"]) , areaName: day, index: i},
        {axis: "Perception", value: getPercentage(doc.data().percepcao, pctScores["percepcao"]), areaName: day, index: i},
        {axis: "Reasoning", value: getPercentage(doc.data().raciocinio, pctScores["raciocinio"]), areaName: day, index: i},
        {axis: "Memory", value: getPercentage(doc.data().memoria, pctScores["memoria"]), areaName: day, index: i}
      ]})
  })
    userscores.reverse()
    // userscores = userscores.map((doc) => doc.slice(1, 6))
    const data = snapshot.docs.map((doc) => doc.data());
    radarChartOptions.color = d3.scaleOrdinal().range(colorRange.slice(-data.length))
    //Call function to draw the Radar chart
    RadarChart(".radarChart", userscores, radarChartOptions);

    var mostRecent = []

    userscores.reverse()
    userscores[0].values.forEach((d, i) => {
      mostRecent.push({Game: d.axis, Score: ~~(d.value*100)})
    })

    console.log(mostRecent)

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
    "Attention Score": {type:"number"},
    "Coordination Score": {type:"number"},
    "Perception Score": {type:"number"},
    "Reasoning Score": {type:"number"},
    "Memory Score": {type:"number"}};
  
  let parallelGraph = onSnapshot(pQuery, (snapshot) => {
    var object = {}
    // for each user, get their most recent score
    snapshot.docs.forEach((doc, i) => {
      object[doc.data().email] = {
      "Attention Score": Math.max(doc.data().atencao, 0),
      "Coordination Score": Math.max(doc.data().coordenacao, 0),
      "Perception Score": Math.max(doc.data().percepcao, 0),
      "Reasoning Score": Math.max(doc.data().raciocinio, 0),
      "Memory Score": Math.max(doc.data().memoria, 0),
      "key": doc.data().email}
    })
    // flatten object
    var userscores = []
    Object.values(object).forEach(doc => {
      userscores.push({"email": doc.key, 
                       "Attention Score": doc["Attention Score"],
                       "Coordination Score": doc["Coordination Score"],
                       "Perception Score": doc["Perception Score"],
                       "Reasoning Score": doc["Reasoning Score"],
                       "Memory Score": doc["Memory Score"]})
    })
    
    d3.select(".parcoords").select("svg").remove();
    var pc2 = ParCoords()(".parcoords");
    pc2
      .data(userscores)
      .dimensions(dimensions)
      .color(function(d) {
        if (d.email.toLowerCase() === useremail)
            return colorRange.slice(-1);
        else
            return "#000";
    })
      .alpha(0.6)
      .margin(parmargin)
      .render()
      .reorderable()
      .brushMode("1D-axes")  // enable brushing;
      .mark(userscores.filter(d => d.email.toLowerCase() === useremail))
  })
})
})


// Parallel coordinates
