const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  shortName: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Post', postSchema);
