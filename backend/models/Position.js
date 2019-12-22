const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const positionSchema = new Schema({
  name: {type: String, required: true },
  shortName: {type: String, required: true },
  seniorPosition: {
    type: Schema.Types.ObjectId,
    ref: 'Position',
  },
  juniorPositions: [{
    type: Schema.Types.ObjectId,
    ref: 'Position',
  }]
});

module.exports = mongoose.model('Position', positionSchema);
