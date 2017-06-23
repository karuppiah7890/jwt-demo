const mongoose = require('mongoose'),
  Post = mongoose.model('Post')

module.exports = {
  routes: function(app) {

    // GET - JSON response
    app.get('/getPosts', (req, res) => {

      console.log(req.query)

      if(!req.user) {
        res.json({
          status: 'error',
          error: 'You must login first'
        })
        return
      }

      const {
        beforeTimestamp,
        afterTimestamp
      } = req.query;

      let beforeTs, afterTs, limit

      if(afterTimestamp && beforeTimestamp) {
        // for getting posts in between two timestamps
        afterTs = new Date(afterTimestamp)
        beforeTs = new Date(beforeTimestamp)
      } else if(afterTimestamp){
        // for getting latest posts after a timestamp
        afterTs = new Date(afterTimestamp)
        beforeTs = new Date()
      } else if(beforeTimestamp){
        // for getting older posts before a timestamp
        afterTs = new Date("1970-01-01")
        beforeTs = new Date(beforeTimestamp)
        limit = 10
      } else {
        // for getting latest posts
        afterTs = new Date("1970-01-01")
        beforeTs = new Date()
        limit = 10
      }

      console.log(' afterTs: ', afterTs, '. beforeTs: ', beforeTs);

      let query = Post.where('createdAt').gt(afterTs).lt(beforeTs).sort({ createdAt: 'desc' })

      query.limit(limit).exec()
      .then((result) => {
        if(!result) {
          res.json({
            status: 'error',
            error: 'Some error occurred'
          })
        } else {
          //console.log(result)
          res.json({
            status: 'success',
            data: result
          })
        }
      })
      .catch((err) => {
        res.json({
          status: 'error',
          error: err
        })
      })
    })

    // GET - JSON response
    app.get('/createPost', (req, res) => {

      console.log(req.query)

      if(!req.user) {
        res.json({
          status: 'error',
          error: 'You must login first'
        })
        return
      }
        //console.log(req.body)
      const {
        post
      } = req.query

      const newPost = {
        id: Math.floor(Math.random() * 10000000000),
        createdBy: req.user.username,
        post: post
      }

      console.log(newPost);

      Post.create(newPost)
      .then((result) => {
        if(result) {
          res.json({
            status: 'success',
            message: 'Post created',
            data: result
          })
        } else {
          throw new Error('Some error occurred')
        }
      })
      .catch((err) => {
        console.log(err)
        res.json({
          status: 'error',
          error: err
        })
      })

    })

  }
}
