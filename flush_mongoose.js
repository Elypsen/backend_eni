const { mongoose } = require('./mongoose')
const { GameModel } = require('./models/game')
const { UserModel } = require('./models/user')
const { TeamModel } = require('./models/team')
const uuid = require('uuid')

async function database() {
  await mongoose().connect()
  let userRepository = await mongoose().repositories('user')
  let gameRepository = await mongoose().repositories('game')
  let teamRepository = await mongoose().repositories('team')

  console.log('Database flushing...')
  await userRepository.deleteMany()
  await gameRepository.deleteMany()
  await teamRepository.deleteMany()
  console.log('Database cleared')

  console.log('Database seeding...')
  await userRepository.create({
    email: 'admin@express-brains.local',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$QrMXiyCxsLjv700OAZzDkQ$abhVv5mq+rZ4gS9koYTSS7MXdWWOBU+eAJY/oZ56wsw',
    role: 'admin',
  })

  const names = [
    'Jackson',
    'Jacob',
    'James',
    'Jasmine',
    'Jason',
    'Jayden',
    'Jeffrey',
    'Jennifer',
    'Jessica',
    'Jonathan',
  ]

  const users = []
  for (const name of names) {
    users.push(
      await userRepository.create({
        email: `${name.toLowerCase()}@express-brains.local`,
        nickname: name,
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$jzQB9YoLnTyZpL66ZxWcYA$KaL4B8QM0Ni87d8bhK1bRM8O1lwU1f9H/SPSX9S4rlQ',
        role: 'user',
      }),
    )
  }

  await teamRepository.create({
    name: 'The winners',
    members: [users[0]._id, users[1]._id],
  })
}
database()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
