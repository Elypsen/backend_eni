const express = require('express')
const argon2 = require('argon2')
const { body, validationResult } = require('express-validator')
const { mongoose } = require('../../mongoose')
const checkTokenMiddleware = require('./middleware')

const router = express.Router()

router.get('/api/teams', async (req, res) => {
  // #swagger.tags = ['Teams']
  // #swagger.description = 'Endpoint to get all teams.'
  // #swagger.summary = 'Get all teams'
  // #swagger.responses[200] = { description: 'Teams found.' }

  let teamRepository = await mongoose().repositories('team')
  let teams = await teamRepository.findAll()

  let response = []

  for (const team of teams) {
    team_response = {
      uuid: team.uuid,
      name: team.name,
      members: team.members,
    }
    let users = []
  //   for (const member of team.members) {
  //     users.push('/api/users/' + member.uuid)
  //   }
  //   team_response.members = users
       response.push(team_response)
  }
  console.log(teams);
  return res.json(response)
})

router.post(
  '/api/teams',
  checkTokenMiddleware,
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
    // #swagger.tags = ['Teams']
    // #swagger.description = 'Endpoint to create a team. The team must have at least 2 members. The team name must contain at least 4 characters. Only the admin can create a team.'
    // #swagger.summary = 'Create a team'
    // #swagger.parameters['team'] = {"in": "body", "description": "Team to create", "required": true, "schema": {"$ref": "#/definitions/Team"}}
    /* #swagger.security = [{
      "bearerAuth": []
    }]*/
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(422)
      const errorMessages = []
      errors.array().forEach((error) => {
        errorMessages[error.param] = error.msg
      })
      return res.json(Object.assign({}, errorMessages))
    }

    const users = []
    let userRepository = await mongoose().repositories('user')
    for (const member of req.body.members) {
      let user = await userRepository.findByUuid(member.match(/\/api\/users\/(.*)/)[1])
      users.push(user)
    }

    let teamRepository = await mongoose().repositories('team')
    let team = await teamRepository.create({
      name: req.body.name,
      members: users.map((user) => user._id),
    })

    res.status(201).json({
      uuid: team.uuid,
      name: team.name,
      members: users.map((user) => '/api/users/' + user.uuid),
    })
  },
)

module.exports = router
