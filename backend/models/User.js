const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Employee = require('../models/Employee');

const userSchema = new Schema({
  login: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  }
});

module.exports = mongoose.model('User', userSchema);
