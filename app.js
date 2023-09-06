const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const sassMiddleware = require('node-sass-middleware')
const swaggerUi = require('swagger-ui-express')
const {SWAGGER_HOST, SWAGGER_SCHEME, VERSION} = require('./env')

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')
const teamsRouter = require('./routes/teams')
const rankRouter = require('./routes/rank')

const apiGameRouter = require('./routes/api/game')
const apiAuthRouter = require('./routes/api/auth')
const apiUsersRouter = require('./routes/api/users')
const apiTeamsRouter = require('./routes/api/teams')
const apiRankRouter = require('./routes/api/rank')

const flash = require('connect-flash')
const session = require('express-session')
const { mongoose } = require('./mongoose')
const swaggerFile = require("./bin/swagger_output.json");
const app = express()

app.use(cors())
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'bootstrap'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true,
  }),
)

app.use(express.static(path.join(__dirname, 'public')))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({
    secret: '!changeme!',
    saveUninitialized: true,
    resave: true,
  }),
)
app.use(flash())

app.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success')
  res.locals.flashError = req.flash('error')
  res.locals.user = req.session.user
  res.locals.path = req.path
  next()
})

app.use('/', indexRouter)
app.use('/', authRouter)
app.use('/users', usersRouter)
app.use('/teams', teamsRouter)
app.use('/rank', rankRouter)

const outputFile = './swagger_output.json'
const swaggerAutogen = require('swagger-autogen')()
const doc = {
  info: {
    title: 'API Express Brains',
    description: 'Public API for Express Brains Game',
    version: VERSION,
  },
  host: SWAGGER_HOST,
  schemes: [SWAGGER_SCHEME],
  definitions: {
    Credentials: {
      email: 'admin@express-brains.local',
      password: 'admin',
    },
    UserWrite: {
      email: 'example@express-brains.local',
      nickname: 'John Doe',
      password: 'password',
      passwordConfirmation: 'password',
    },
    UserRead: {
      uuid: 'a1b651df-c53e-48c9-97f1-ed92c0fabb25',
      email: 'example@express-brains.local',
      nickname: 'John Doe',
    },
    Team: {
      name: 'Team 1',
      members: [
        '/api/users/a1b651df-c53e-48c9-97f1-ed92c0fabb25',
        '/api/users/4b7fa20b-f6bd-48f2-84ad-5aab90910beb',
        '/api/users/z1b651df-c53d-48c9-97f1-ed92c0fabb28',
      ],
    },
  },
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
  security: {
    bearerAuth: [],
  },
  components: {
    examples: {
      Credentials: {
        value: {
          email: 'admin@express-brains.local',
          password: 'admin',
        },
      },
      UserWrite: {
        value: {
          email: 'example@express-brains.local',
          nickname: 'John Doe',
          password: 'password',
          passwordConfirmation: 'password',
        },
      },
      UserRead: {
        value: {
          uuid: 'a1b651df-c53e-48c9-97f1-ed92c0fabb25',
          email: 'example@express-brains.local',
          nickname: 'John Doe',
        },
      },
      Team: {
        value: {
          name: 'Team 1',
          members: [
            '/api/users/a1b651df-c53e-48c9-97f1-ed92c0fabb25',
            '/api/users/4b7fa20b-f6bd-48f2-84ad-5aab90910beb',
            '/api/users/z1b651df-c53d-48c9-97f1-ed92c0fabb28',
          ],
        },
      },
    },
  },
}

swaggerAutogen(
  outputFile,
  [
    './routes/api/auth.js',
    './routes/api/users.js',
    './routes/api/teams.js',
    './routes/api/rank.js',
    './routes/api/game.js',
  ],
  doc,
).then((response) => {
  console.log('Swagger file generated')
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(response['data']))
  app.use('/', apiAuthRouter)
  app.use('/', apiGameRouter)
  app.use('/', apiUsersRouter)
  app.use('/', apiTeamsRouter)
  app.use('/', apiRankRouter)

// catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404))
  })

// error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
  })
})

module.exports = app
