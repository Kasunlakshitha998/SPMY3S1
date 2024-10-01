const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPaid: {
    type: String,
    required: true,
    default : 'no',
  },
});

module.exports = mongoose.model('User', UserSchema);
