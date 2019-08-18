const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rankSchema = new Schema({
  index: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  shortName: {
    type: String,
    required: true
  },
});

module.exports = new mongoose.model('Rank', rankSchema);
