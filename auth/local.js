module.exports = function(passport) {

  const LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    User = mongoose.model('User')


  passport.use(new LocalStrategy(
    function(username, password, done) {
      console.log(username, password)
      User.findOne({username: username, password: password})
      .then((result) => {
          console.log(result)
          if(result) {
            //console.log("found local user in db", result)
            done(null, result)
          } else {
            done(null, false)
          }
      })
      .catch((err) => {
        done(err)
      })
    }
  ))

  return {
    routes: function(app) {
      app.post('/login',
                passport.authenticate('local', { successRedirect: '/',
                                                 failureRedirect: '/login'}))

       app.get('/signup', (req,res) => {
         res.render('signup.html')
       })

       app.post('/signup', (req,res) => {
         //console.log(req.body)
         if(req.body.username === '' || req.body.password === '') {
           res.redirect('/signup')
         }
         User.findOne({username: req.body.username})
         .then((result) => {
             if(result) {
               //console.log("found local user in db", result)
               res.redirect('/signup')
             } else {
               const profile = {
                 id: Math.floor(Math.random() * 10000000000),
                 username: req.body.username,
                 password: req.body.password,
                 displayName: req.body.username
               }
               User.create(profile)
               .then((result) => {
                 req.login(profile, function(err) {
                   if(err) {
                     return console.log(err)
                   }
                   return res.redirect('/')
                 })
               })
               .catch(err => console.log(err))
             }
         })
         .catch((err) => {
           done(err)
         })
       })
    }
  }

}
