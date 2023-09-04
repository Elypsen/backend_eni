const { GameModel } = require('../models/game')
const uuid = require('uuid')

module.exports.gameRepository = (mongoose) => {
  const Game = GameModel(mongoose)
  return {
    async findByUuid(uuid) {
      return Game.findOne({ uuid: uuid })
    },
    async findByUser(user) {
      return Game.findOne({ user: user._id })
    },
    async findByUserAndInProgress(user) {
      return Game.findOne({ user: user._id, inProgress: true })
    },
    async findAll() {
      return Game.find().populate({
        path: 'user',
        select: 'nickname uuid -_id',
      })
    },
    async deleteMany() {
      return Game.deleteMany()
    },
    async create(game) {
      const newGame = new Game(game)
      newGame.uuid = uuid.v4()
      return newGame.save()
    },
    async update(game) {
      return Game.findOneAndUpdate({ _id: game._id }, game)
    },
  }
}
