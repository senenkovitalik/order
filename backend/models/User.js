const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    required: true
  },
  unit: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);
