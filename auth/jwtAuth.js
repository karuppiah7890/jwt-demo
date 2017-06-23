module.exports = function(passport) {

  const  mongoose = require('mongoose'),
    User = mongoose.model('User'),
    jwt = require('jsonwebtoken'),
    passportJWT = require('passport-jwt'),
    ExtractJwt = passportJWT.ExtractJwt,
    JwtStrategy = passportJWT.Strategy,
    jwtOptions = {}

  jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
  jwtOptions.secretOrKey = 'This is a secret key for the test project';

  passport.use(new JwtStrategy(jwtOptions, (jwt_payload, next) => {
    console.log('payload received', jwt_payload);

    User.findOne({ id: jwt_payload.id })
    .then((result) => {
        //console.log(result)
        if(!result) {
          throw new Error('Wrong credentials while authenticating with JWT')
        }
        //console.log("found local user in db", result)
        next(null, result)
    })
    .catch((err) => {
      console.log(err)
      next(null, false)
    })

  }))

  return {
    routes: function(app) {
      app.post('/login', (req, res) => {
        //console.log(req.body)

        const {
          username,
          password
        } = req.body

        User.findOne({username: username, password: password})
        .then((result) => {
            //console.log(result)
            if(!result) {
              throw new Error('Wrong credentials')
            }
            //console.log("found local user in db", result)
            var jwt_payload = {
              id: result.id
            }
            var token = jwt.sign(jwt_payload, jwtOptions.secretOrKey)
            res.json({
              status: "success",
              token: token
            })
        })
        .catch((err) => {
          res.status(401).json({
            error: err.message
          })
        })
      })

       app.post('/signup', (req,res) => {
         //console.log(req.body)
         const {
           username,
           password
         } = req.body

         if(username === '' || password === '') {
           res.status(401).json({
             error: 'Username or Password empty'
           })
           return
         }

         User.findOne({ username: username })
         .then((result) => {
           if(result) {
             //console.log("found local user in db", result)
             throw new Error("Username already exists")
           }

           const profile = {
             id: Math.floor(Math.random() * 10000000000),
             username: username,
             password: password,
             displayName: username
           }

           return User.create(profile)
         })
         .then((result) => {
           res.json({
             message: "User created"
           })
         })
         .catch((err) => {
           res.status(401).json({
             error: err.message
           })
         })
       })
    }
  }

}
