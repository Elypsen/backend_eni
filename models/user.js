module.exports.UserModel = (mongoose) => {
  return mongoose.model('User', {
    uuid: String,
    nickname: String,
    email: String,
    password: String,
    role: String,
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
  })
}
