// env.js
require('dotenv').config()
const SECRET = process.env.SECRET
const MONGO_URI = process.env.MONGO_URI
const SWAGGER_HOST = process.env.SWAGGER_HOST
const SWAGGER_SCHEME = process.env.SWAGGER_SCHEME
const VERSION = process.env.VERSION

module.exports = { SECRET, MONGO_URI, SWAGGER_HOST, SWAGGER_SCHEME, VERSION }
