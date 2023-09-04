const express = require('express')
const argon2 = require('argon2')
const { body, validationResult } = require('express-validator')
const { mongoose } = require('../../mongoose')
const { userRepository } = require('../../repositories/user_repository')
const checkTokenMiddleware = require('./middleware')

const router = express.Router()

router.get('/api/users', checkTokenMiddleware, async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Endpoint to get all users. Only admin can access this endpoint.'
  // #swagger.summary = 'Get all users'
  // #swagger.responses[200] = { description: 'Success' }
  /* #swagger.security = [{
    "bearerAuth": []
  }]*/
  let userRepository = await mongoose().repositories('user')
  let users = await userRepository.findAll()
  res.json(users)
})

router.post(
  '/api/users',
  body('email')
    .custom(async (value, { req }) => {
      // #swagger.tags = ['Users']
      // #swagger.description = 'Endpoint to create a new user.'
      // #swagger.summary = 'Create a new user'
      // #swagger.parameters['user'] = { in: 'body', description: 'User object', required: true, type: 'object', schema: { $ref: "#/definitions/User" } }
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

      return res.json(Object.assign({}, errorMessages))
    }
    const hashPassword = await argon2.hash(req.body.password)
    let userRepository = await mongoose().repositories('user')
    let user = await userRepository.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashPassword,
      role: 'user',
    })
    return res.status(201).json(user)
  },
)

module.exports = router
