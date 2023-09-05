var express = require('express')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../../env.js')
const { findByEmail, userRepository } = require('../../repositories/user_repository')
const argon2 = require('argon2')
const { mongoose } = require('../../mongoose')
var router = express.Router()

router.post('/api/authentication_token', async function (req, res, next) {
  // #swagger.tags = ['Security']
  // #swagger.summary = 'Get authentication token'
  // #swagger.description = 'Endpoint to authenticate a user and return a JWT token'
  // #swagger.parameters['credentials'] = {description: 'Credentials', in: 'body', required: true, type: 'object', schema: { $ref: "#/definitions/Credentials" }}
  let userRepository = await mongoose().repositories('user')
  const user = await userRepository.findByEmail(req.body.email)
  if (user) {
    if (await argon2.verify(user.password, req.body.password)) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
        },
        SECRET,
        { expiresIn: '3 hours' },
      )

      return res.json({ access_token: token })
    } else {
      return res.status(400).json({ message: 'Error. Wrong login or password' })
    }
  } else {
    return res.status(400).json({ message: 'Error. Wrong login or password' })
  }
})

module.exports = router
