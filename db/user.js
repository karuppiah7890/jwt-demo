const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  id: {
    type: String,
    required: [true, 'ID is required']
  },
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  displayName: {
    type: String,
    required: [true, 'Name is required']
  },
})

const User = mongoose.model('User', userSchema);

module.exports = User;
