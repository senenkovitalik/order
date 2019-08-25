const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Unit = require('../models/Unit');
const Rank = require('../models/Rank');
const Address = require('../models/Address');

const employeeSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  patronymic: { type: String, required: true },
  dateOfBirth: Date,
  addressOfResidence: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
    autopopulate: true
  },
  registrationAddress: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
    autopopulate: true
  },
  rank: {
    type: Schema.Types.ObjectId,
    ref: 'Rank',
    required: true,
    autopopulate: true
  },
  position: {
    type: Schema.Types.ObjectId,
    ref: 'Position',
    required: true,
    autopopulate: true
  },
  unit: {
    type: Schema.Types.ObjectId,
    ref: 'Unit'
  },
  type: {
    type: String,
    required: true,
    enum: ['HEAD', 'WORKER'] }
});

employeeSchema.post('remove', async ({_id, addressOfResidence, registrationAddress}) => {
  // delete Employee from Unit.Employees
  const unit = await Unit.find({employees: _id});
  unit.employees = unit.employees.filter(employee => employee._id !== _id);
  try {
    await unit.save();
  } catch (err) {
    throw err;
  }

  // delete Addresses
  const addressesToDelete = [];

  if (addressOfResidence) {
    addressesToDelete.push(addressOfResidence._id)
  }
  if (registrationAddress) {
    addressesToDelete.push(registrationAddress._id)
  }

  try {
    await Address.deleteMany({_id: {$in: addressesToDelete}}).exec();
  } catch (err) {
    throw err;
  }
});

employeeSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Employee', employeeSchema);
