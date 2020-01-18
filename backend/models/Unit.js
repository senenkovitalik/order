const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Employee = require('./Employee');
const Post = require('./Post');

const unitSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  shortName: {
    type: String,
    required: false
  },
  parentUnit: {
    type: Schema.Types.ObjectId,
    ref: 'Unit',
  },
  childUnits: [{
    type: Schema.Types.ObjectId,
    ref: 'Unit',
  }],
  head: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  employees: [{
    type: Schema.Types.ObjectId,
    ref: 'Employee',
  }],
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post',
  }]
});

module.exports = mongoose.models.Unit || mongoose.model('Unit', unitSchema);
