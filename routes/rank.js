const express = require('express')
const argon2 = require('argon2')
const { body, validationResult } = require('express-validator')
const { mongoose } = require('../mongoose')

const router = express.Router()

router.get('/', async (req, res) => {
  let gameRepository = await mongoose().repositories('game')
  let games = await gameRepository.findAll()
  res.render('rank/list', {
    games: games,
  })
})

module.exports = router
