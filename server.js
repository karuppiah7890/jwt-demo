const PORT = process.env.PORT ||  3000

const config = require('./config')(PORT)[process.env.APP_ENV]

const express = require('express')
const app = express()
const db = require('./db')(config)
const auth = require('./auth')(config)
const nunjucks = require('nunjucks')
const postRoutes = require('./routes/postRoutes')

nunjucks.configure('views',{
  autoescaping: true,
  express: app
});

app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('express-session')({ secret: 'Karuppiah is a coder', resave: false, saveUninitialized: false }))

auth.init(app)

app.get('/', (req,res) => {
  if(!req.user){
    res.redirect('/login')
    return
  }

  console.log("Request from User : ",req.user)
  res.render('index.html', {user: req.user})
})

postRoutes.routes(app)

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`)
})
