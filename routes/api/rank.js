const express = require('express')
const argon2 = require('argon2')
const { body, validationResult } = require('express-validator')
const { mongoose } = require('../../mongoose')

const router = express.Router()

router.get('/api/rank', async (req, res) => {
  // #swagger.tags = ['Rank']
  // #swagger.description = 'Endpoint to get the rank of gamers.'
  // #swagger.summary = 'Get rank of gamers.'
  // #swagger.responses[200] = { description: 'Rank of gamers.' }

  let gameRepository = await mongoose().repositories('game')
  let games = await gameRepository.findAll()

  let response = []
  for (const game of games) {
    game_response = {
      uuid: game.uuid,
      attempts: game.attempts,
      time: game.time,
      inProgress: game.inProgress,
    }

    if (!game.inProgress) {
      game_response.numberToFind = game.numberToFind
    }

    if (game.user) {
      game_response.user = '/api/users/' + game.user.uuid
    }

    response.push(game_response)
  }
  return res.json(response)
})

module.exports = router
