const { ResultTypes } = require('../enums/result-types')
exports.tryNumber = function (attempt, numberToFind) {
  let response = {
    ResultTypes: ResultTypes,
  }

  if (attempt === numberToFind) {
    response = {
      resultType: ResultTypes.CORRECT,
      numberToFind: numberToFind,
      text: 'Bravo ! Vous avez gagné',
      ...response,
    }
  } else if (attempt > numberToFind) {
    response = {
      resultType: ResultTypes.TOO_HIGH,
      text: 'Vous êtes trop haut !',
      ResultTypes: ResultTypes,
      ...response,
    }
  } else if (attempt < numberToFind) {
    response = {
      resultType: ResultTypes.TOO_LOW,
      text: 'Vous êtes trop bas !',
      ResultTypes: ResultTypes,
      ...response,
    }
  } else {
    response = {
      resultType: ResultTypes.ERROR,
      text: 'Erreur ! Vous devez saisir un nombre',
      ResultTypes: ResultTypes,
      ...response,
    }
  }
  return response
}
