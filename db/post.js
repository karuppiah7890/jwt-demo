const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: [true, 'Username of the User who created the post is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  post: {
    type: String,
    required: true
  }
})

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
