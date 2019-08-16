const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  patronymic: { type: String, required: true },
  dateOfBirth: Date,
  addressOfResidence: {
    type: Schema.Types.ObjectId,
    ref: 'Address'
  },
  registrationAddress: {
    type: Schema.Types.ObjectId,
    ref: 'Address'
  },
  position: {
    type: Schema.Types.ObjectId,
    ref: 'Position'
  }
});

module.exports = mongoose.model('Employee', employeeSchema);
