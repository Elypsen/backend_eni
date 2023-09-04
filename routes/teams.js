const express = require('express')
const argon2 = require('argon2')
const { body, validationResult } = require('express-validator')
const { mongoose } = require('../mongoose')

const router = express.Router()

router.get('/', async (req, res) => {
  let teamRepository = await mongoose().repositories('team')
  let teams = await teamRepository.findAll()
  res.render('teams/list', {
    teams: teams,
  })
})

router.get('/create', async function (req, res, next) {
  if (req.session.user === undefined) {
    res.redirect('/login')
  }

  if (req.session.user && req.session.user.role !== 'admin') {
    res.status(403)
    return res.render('errors/403')
  }

  const userRepository = await mongoose().repositories('user')
  const users = await userRepository.findAll()
  res.render('teams/create', {
    users: users,
  })
})

router.post(
  '/create',
  body('name').isLength({ min: 4 }).withMessage('Doit contenir au moins 4 caractères'),
  body('members')
    .isArray()
    .custom((value) => {
      if (!Array.isArray(value) || value.length < 2) {
        throw new Error('Doit contenir au moins 2 membres')
      }
      return true
    })
    .withMessage('Doit contenir au moins 2 membres'),
  async function (req, res, next) {
    if (req.session.user === undefined) {
      res.redirect('/login')
    }

    if (req.session.user && req.session.user.role !== 'admin') {
      res.status(403)
      return res.render('errors/403')
    }

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(422)
      const errorMessages = []
      errors.array().forEach((error) => {
        errorMessages[error.param] = error.msg
      })
      const userRepository = await mongoose().repositories('user')
      const users = await userRepository.findAll()
      return res.render('teams/create', {
        name: req.body.name,
        users: users,
        errors: errorMessages,
      })
    }

    let teamRepository = await mongoose().repositories('team')
    await teamRepository.create({
      name: req.body.name,
      members: req.body.members,
    })
    res.redirect('/teams')
  },
)

module.exports = router
