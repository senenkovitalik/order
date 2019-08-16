const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const positionSchema = new Schema({
  name: {type: String, required: true },
  shortName: {type: String, required: true },
  seniorPosition: {
    type: Schema.Types.ObjectId,
    ref: 'Position',
    autopopulate: true
  },
  juniorPositions: [{
    type: Schema.Types.ObjectId,
    ref: 'Position',
    autopopulate: true
  }]
});

positionSchema.plugin(require('mongoose-autopopulate'))

module.exports = mongoose.model('Position', positionSchema);
