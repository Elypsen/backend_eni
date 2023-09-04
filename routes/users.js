const express = require('express')
const argon2 = require('argon2')
const { body, validationResult } = require('express-validator')
const { mongoose } = require('../mongoose')
const { userRepository } = require('../repositories/user_repository')

const router = express.Router()

router.get('/', async (req, res) => {
  if (req.session.user === undefined) {
    res.redirect('/login')
  }

  if (req.session.user && req.session.user.role !== 'admin') {
    res.status(403)
    return res.render('errors/403')
  }

  let userRepository = await mongoose().repositories('user')
  let users = await userRepository.findAll()
  res.render('users/list', {
    users: users,
  })
})

router.get('/create', function (req, res, next) {
  res.render('users/create')
})

router.post(
  '/create',
  body('email')
    .custom(async (value, { req }) => {
      let userRepository = await mongoose().repositories('user')
      const user = await userRepository.findByEmail(value)
      if (user) {
        throw new Error('Cette adresse email est déjà utilisée')
      }
      return true
    })
    .isEmail()
    .withMessage('Merci de saisir une adresse email valide'),
  body('nickname')
    .custom(async (value, { req }) => {
      let userRepository = await mongoose().repositories('user')
      const user = await userRepository.findByNickname(value)
      if (user) {
        throw new Error('Ce pseudo est déjà utilisée')
      }
      return true
    })
    .isLength({ min: 3 })
    .withMessage('Le pseudo doit contenir au moins 3 caractères'),
  body('password').isLength({ min: 4 }).withMessage('Doit contenir au moins 4 caractères'),
  body('passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Les mots de passes ne correspondent pas')
    }
    // Indicates the success of this synchronous custom validator
    return true
  }),
  async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(422)
      const errorMessages = []
      errors.array().forEach((error) => {
        errorMessages[error.param] = error.msg
      })
      return res.render('users/create', {
        email: req.body.email,
        nickname: req.body.nickname,
        errors: errorMessages,
      })
    }
    const hashPassword = await argon2.hash(req.body.password)
    let userRepository = await mongoose().repositories('user')
    await userRepository.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashPassword,
      role: 'user',
    })
    req.flash('success', `Votre compte ${req.body.email} a bien été créé`)
    res.redirect('/login')
  },
)

module.exports = router
