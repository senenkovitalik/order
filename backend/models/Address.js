const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  region: {type: String },
  district: {type: String },
  city: {type: String },
  village: {type: String },
  urbanVillage: {type: String },
  street: {type: String },
  houseNumber: {type: String },
  apartmentNumber: {type: String }
});

module.exports = mongoose.model('Address', addressSchema);
