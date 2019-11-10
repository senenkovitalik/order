const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Unit = require('./unit');
const MonthDuties = require('./MonthDuties');

const postSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  unit: {
    type: Schema.Types.ObjectId,
    ref: 'Unit',
    required: true
  }
});

postSchema.post('save', async ({_id, unit: unitId}) => {
  // add post _id into Unit posts array
  try {
    const unit = await Unit.findById(unitId);
    unit.posts.push(_id);
    await unit.save();
  } catch (err) {
    console.log(err);
  }
});

postSchema.pre('remove', async function() {
  try {
    // delete Post from Unit.Posts
    const updatedUnit = await Unit.findById(this.unit).exec();
    updatedUnit.posts = updatedUnit.posts.filter(post => post._id.toString() !== this._id.toString());
    await updatedUnit.save();

    // delete month duties associated with post
    await MonthDuties.findOneAndRemove({post: new mongoose.Types.ObjectId(this._id)}).exec();
  } catch (err) {
    throw err;
  }
});

module.exports = mongoose.model('Post', postSchema);
