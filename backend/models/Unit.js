const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const unitSchema = new Schema({
  name: { type: String, required: true },
  shortName: { type: String, required: false },
  parentUnit: {
    type: Schema.Types.ObjectId,
    ref: 'Unit',
  },
  childUnits: [{
    type: Schema.Types.ObjectId,
    ref: 'Unit'
  }],
  head: {
    type: Schema.Types.ObjectId,
    ref: 'Person',
    required: true
  },
  employees: [{
    type: Schema.Types.ObjectId,
    ref: 'Person'
  }]
});

module.export = mongoose.model('Unit', unitSchema);
