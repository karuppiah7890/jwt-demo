const PORT = process.env.PORT ||  3000

const config = require('./config')(PORT)[process.env.APP_ENV]

const express = require('express')
const app = express()
const db = require('./db')(config)
const auth = require('./auth')()
const nunjucks = require('nunjucks')
const postRoutes = require('./routes/postRoutes')
const bodyParser = require('body-parser')

nunjucks.configure('views',{
  autoescaping: true,
  express: app
});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

auth.init(app)
const passport = auth.getPassport()

app.get('/', passport.authenticate('jwt', { session: false }), (req,res) => {
  res.json({
    message: `Hello ${req.user.username}`
  })
})

postRoutes.routes(app, passport)

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`)
})
