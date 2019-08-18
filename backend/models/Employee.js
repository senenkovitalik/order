const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Unit = require('../models/Unit');
const Rank = require('../models/Rank');

const employeeSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  patronymic: { type: String, required: true },
  dateOfBirth: Date,
  addressOfResidence: {
    type: Schema.Types.ObjectId,
    ref: 'Address'
  },
  registrationAddress: {
    type: Schema.Types.ObjectId,
    ref: 'Address'
  },
  rank: {
    type: Schema.Types.ObjectId,
    ref: 'Rank',
    required: true
  },
  position: {
    type: Schema.Types.ObjectId,
    ref: 'Position',
    required: true
  },
  unit: {
    type: Schema.Types.ObjectId,
    ref: 'Unit'
  },
  type: {
    type: String,
    required: true,
    enum: ['HEAD', 'WORKER'] }
});

module.exports = mongoose.model('Employee', employeeSchema);
