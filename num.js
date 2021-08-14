function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log("8"+`=`.repeat(randomInteger(0, 10))+"D")