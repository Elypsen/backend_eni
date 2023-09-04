class RandomNumber {
  static generate() {
    console.log('Generating a random number')
    let numberToFind = Math.floor(Math.random() * 100)
    if (numberToFind === 0) {
      numberToFind = 1
    }
    return numberToFind
  }
}

module.exports = { RandomNumber }
