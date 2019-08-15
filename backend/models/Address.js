const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  region: {type: String },
  district: {type: String },
  city: {type: String },
  village: {type: String },
  urbanVillage: {type: String },
  street: {type: String, required: true },
  houseNumber: {type: String, required: true },
  apartmentNumber: {type: String }
});

module.export = mongoose.model('Address', addressSchema);
