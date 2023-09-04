var express = require('express')
const { findByEmail, userRepository } = require('../repositories/user_repository')
const argon2 = require('argon2')
const { mongoose } = require('../mongoose')
var router = express.Router()

router.get('/login', function (req, res, next) {
  res.render('login')
})

router.post('/login', async function (req, res, next) {
  let userRepository = await mongoose().repositories('user')
  const user = await userRepository.findByEmail(req.body.email)

  if (user) {
    if (await argon2.verify(user.password, req.body.password)) {
      req.session.user = user
      req.flash('success', `Bonjour ${user.email}`)
      res.redirect('/')
    } else {
      res.render('login', {
        flashError: 'Email ou mot de passe incorrect',
        email: req.body.email,
      })
    }
  } else {
    res.render('login', {
      flashError: 'Email ou mot de passe incorrect',
      email: req.body.email,
    })
  }
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

module.exports = router
