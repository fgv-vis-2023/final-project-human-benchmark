export function boxMullerTransform() {
    const u1 = Math.random();
    const u2 = Math.random();
    
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    
    return z0;
}

export function sampleNormal(mean, stddev) {
    const z0 = boxMullerTransform();
    
    return z0 * stddev + mean;
}

export function sampleScore(mean, stddev) {
    let score = sampleNormal(mean, stddev);
    score = Math.max(score, 0);
    score = Math.min(score, 100);
    return ~~score;  // ~~ is a faster version of Math.floor()
}

export function getPercentage(score, pctArray) {
    let pct = 0;
    for (let i = 0; i <= 100; i++) {
        if (score >= pctArray[100]) {
            pct = 100;
            break;
        }
        if (score < pctArray[i]) {
            pct = i;
            break;
        }
    }
    return pct/100;
}

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
//         email: "user" + i + "@gmail.com",
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