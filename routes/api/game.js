var express = require('express')
const { RandomNumber } = require('../../services/random-number')
const { tryNumber } = require('../../services/try-number')
const { mongoose } = require('../../mongoose')
const { ResultTypes } = require('../../enums/result-types')
const checkTokenMiddleware = require('./middleware')
var router = express.Router()

router.post('/api/game', checkTokenMiddleware, async function (req, res, next) {
  // #swagger.tags = ['Game']
  // #swagger.description = 'Endpoint to play the game. It receives a number and returns the result of the game. For the API, you need to be authenticated to play the game.'
  // #swagger.summary = 'Play the game'
  /* #swagger.parameters['attempt'] = {
               in: 'body',
               description: 'Object with the number to try.',
               required: true,
               type: 'object',
               schema: { $attempt: 25 }
  } */
  /* #swagger.security = [{
    "bearerAuth": []
  }]*/

  const userRepository = await mongoose().repositories('user')
  let user = await userRepository.find(req.user.id)

  let attempt = parseInt(req.body.attempt)
  const gameRepository = await mongoose().repositories('game')

  let game = await gameRepository.findByUserAndInProgress(user)
  if (!game) {
    game = await gameRepository.create({
      user: user,
      numberToFind: RandomNumber.generate(),
      attempts: 0,
      inProgress: true,
      time: 0,
      startTime: new Date(),
    })
  }

  let response = tryNumber(attempt, game.numberToFind)
  game.attempts++

  if (response.resultType === ResultTypes.CORRECT) {
    game.inProgress = false
    game.time = Math.abs(new Date().getTime() - new Date(game.startTime).getTime()) / 1000
    game.save()
  } else {
    game.time = Math.abs(new Date().getTime() - new Date(game.startTime).getTime()) / 1000
    game.save()
  }

  const responseGame = {
    uuid: game.uuid,
    attempts: game.attempts,
    time: game.time,
    inProgress: game.inProgress,
    resultType: response.resultType,
    resultText: response.text,
  }

  return res.json(responseGame)
})

module.exports = router
