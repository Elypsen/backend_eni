module.exports.GameModel = (mongoose) => {
  return mongoose.model('Game', {
    uuid: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    attempts: Number,
    numberToFind: Number,
    time: Number,
    inProgress: Boolean,
    startTime: Date,
  })
}
