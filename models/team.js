module.exports.TeamModel = (mongoose) => {
  return mongoose.model('Team', {
    uuid: String,
    name: String,
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  })
}
