const { UserModel } = require('../models/user')
const uuid = require('uuid')

module.exports.userRepository = (mongoose) => {
  const User = UserModel(mongoose)
  return {
    async findByEmail(email) {
      return User.findOne({ email: email })
    },
    async findByNickname(nickname) {
      return User.findOne({
        nickname: {
          $regex: new RegExp(nickname, 'i'),
        },
      })
    },
    async findByUuid(uuid) {
      return User.findOne({ uuid: uuid })
    },
    async find(id) {
      return User.findOne({ _id: id })
    },
    async findAll() {
      return User.find()
    },
    async deleteMany() {
      return User.deleteMany()
    },
    async create(user) {
      const newUser = new User(user)
      newUser.uuid = uuid.v4()
      return newUser.save()
    },
  }
}
