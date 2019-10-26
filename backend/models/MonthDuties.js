const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const monthDutiesSchema = new Schema({
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    min: 1,
    max: 12,
    required: true
  },
  unit: {
    type: Schema.Types.ObjectId,
    ref: 'Unit',
    required: true,
    autopopulate: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  duties: [{
    day: {
      type: Number,
      min: 1,
      max: 31,
      required: true
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      autopopulate: true
    },
    type: {
      type: String,
      required: true
    }
  }]
});

monthDutiesSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('MonthDuties', monthDutiesSchema);
