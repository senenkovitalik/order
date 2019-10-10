const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Unit = require('./Unit');
const Rank = require('../models/Rank');
const Position = require('../models/Position');
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
    ref: 'Unit',
    required: true,
    autopopulate: true
  },
  type: {
    type: String,
    default: 'WORKER',
    required: false,
    enum: ['HEAD', 'WORKER'] }
});

employeeSchema.post('save', async (doc) => {
  // add employee _id into Unit employees array
  try {
    const unit = await Unit.findById(doc.unit);
    unit.employees.push(doc._id);
    await unit.save();
  } catch (err) {
    console.log(err);
  }

});

employeeSchema.post('remove', async ({_id, unit, addressOfResidence, registrationAddress}) => {
  // delete Employee from Unit.Employees
  try {
    const updatedUnit = await Unit.findById(unit._id);
    updatedUnit.employees = updatedUnit.employees.filter(employee => employee._id.toString() !== _id.toString());
    await updatedUnit.save();
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
