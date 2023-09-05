const mongoose = require('mongoose')
const { MONGO_URI } = require('./env')
const { userRepository } = require('./repositories/user_repository')
const { gameRepository } = require('./repositories/game_repository')
const { teamRepository } = require('./repositories/team_repository')

let connected = false
let repositoriesLoaded = false
let repositories = []

module.exports.mongoose = () => {
  let load = new Promise((resolve, reject) => {
    if (!repositoriesLoaded && connected) {
      setInterval(() => {
        if (repositoriesLoaded) {
          resolve(repositories)
        }
      }, 10)
      return
    }
    if (repositoriesLoaded) {
      resolve(repositories)
      return
    }
    connected = true
    mongoose
      .connect(MONGO_URI)
      .then(() => {
        repositories.push({
          name: 'user',
          repository: userRepository(mongoose),
        })
        repositories.push({
          name: 'game',
          repository: gameRepository(mongoose),
        })
        repositories.push({
          name: 'team',
          repository: teamRepository(mongoose),
        })
        repositoriesLoaded = true
        resolve()
      })
      .catch((err) => {
        console.log('Error connecting to MongoDB:', err)
        connected = false
        reject(err)
      })
  })
  return {
    instance: mongoose,
    connect: async () => {
      return await load
    },
    repositories: function (name) {
      return load.then(() => {
        return repositories.find((repository) => {
          return repository.name === name
        }).repository
      })
    },
  }
}
