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

unitSchema.post('save', async function(doc) {
  // insert Unit _id into parentUnit childUnits array
  try {
    const parentUnit = await mongoose.models.Unit.findById(doc.parentUnit);
    await mongoose.models.Unit.findByIdAndUpdate(doc.parentUnit, {childUnits: parentUnit.childUnits.concat(doc._id)});
  } catch (err) {
    throw err;
  }
});

unitSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.models.Unit || mongoose.model('Unit', unitSchema);
