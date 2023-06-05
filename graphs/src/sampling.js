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