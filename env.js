// env.js
require('dotenv').config()
const SECRET = process.env.SECRET
const MONGO_URI = process.env.MONGO_URI

module.exports = { SECRET, MONGO_URI }
