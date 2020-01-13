const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dutySchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  },
  type: {
    type: String,
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }
});

module.exports = mongoose.model('Duty', dutySchema);
