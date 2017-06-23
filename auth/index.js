module.exports = function() {

  const mongoose = require('mongoose'),
  User = mongoose.model('User'),
  passport = require('passport'),
  jwtAuth = require('./jwtAuth')(passport)

  return {
    init: function(app) {
      app.use(passport.initialize())

      app.get('/login', (req,res) => {
        res.render('login.html')
      })

      jwtAuth.routes(app)

      app.get('/logout', function(req, res){
        req.logout()
        res.redirect('/')
      })
    },

    getPassport: function() {
      return passport
    }
  }
}
