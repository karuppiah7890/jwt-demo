module.exports = function(config) {

  const mongoose = require('mongoose')

  mongoose.Promise = global.Promise
  mongoose.connect(config.mongoUrl)

  const connection = mongoose.connection

  connection.on('error', function(err) {
    console.error(err)
  })

  connection.once('open', function() {
    console.log('Connected to MongoDB!')
  })

  require('./user')
  require('./post')

}
