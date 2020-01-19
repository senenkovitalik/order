const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Rank = require('../models/Rank');
const Position = require('../models/Position');

const employeeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  patronymic: {
    type: String,
    required: true
  },
  rank: {
    type: Schema.Types.ObjectId,
    ref: 'Rank',
    required: true,
  },
  position: {
    type: Schema.Types.ObjectId,
    ref: 'Position',
    required: true,
  }
});

module.exports = mongoose.model('Employee', employeeSchema);
