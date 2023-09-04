const { TeamModel } = require('../models/team')
const uuid = require('uuid')

module.exports.teamRepository = (mongoose) => {
  const Team = TeamModel(mongoose)
  return {
    async findByUuid(uuid) {
      return Team.findOne({ uuid: uuid })
    },
    async findAll() {
      return Team.find().populate({
        path: 'members',
        select: 'nickname uuid -_id',
      })
    },
    async deleteMany() {
      return Team.deleteMany()
    },
    async create(team) {
      const newTeam = new Team(team)
      newTeam.uuid = uuid.v4()
      return newTeam.save()
    },
  }
}
