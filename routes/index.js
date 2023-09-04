var express = require('express')
const { RandomNumber } = require('../services/random-number')
const { tryNumber } = require('../services/try-number')
const { mongoose } = require('../mongoose')
const { ResultTypes } = require('../enums/result-types')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { start: !req.session.numberToFind })
})

router.post('/', async function (req, res, next) {
  let attempt = parseInt(req.body.attempt)
  let play = req.body.play

  const gameRepository = await mongoose().repositories('game')

  if (play) {
    req.session.numberToFind = RandomNumber.generate()
    req.session.attempts = 0
    req.session.startTime = new Date()
    let game = await gameRepository.create({
      user: req.session.user,
      numberToFind: req.session.numberToFind,
      attempts: 0,
      inProgress: true,
      time: 0,
    })
    req.session.game_id = game._id
    return res.render('index')
  }
  let response = tryNumber(attempt, req.session.numberToFind)
  req.session.attempts++

  if (response.resultType === ResultTypes.CORRECT) {
    req.session.numberToFind = null
    gameRepository.update({
      _id: req.session.game_id,
      attempts: req.session.attempts,
      inProgress: false,
      time: Math.abs(new Date().getTime() - new Date(req.session.startTime).getTime()) / 1000,
    })
  } else {
    gameRepository.update({
      _id: req.session.game_id,
      attempts: req.session.attempts,
      time: Math.abs(new Date().getTime() - new Date(req.session.startTime).getTime()) / 1000,
    })
  }
  res.render('index', {
    response: response,
  })
})

module.exports = router
