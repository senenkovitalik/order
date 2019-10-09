const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Unit = require('./unit');

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

postSchema.post('remove', async ({_id, unit: unitId}) => {
  // delete Post from Unit.Posts
  try {
    const updatedUnit = await Unit.findById(unitId);
    updatedUnit.posts = updatedUnit.posts.filter(post => post._id.toString() !== _id.toString());
    await updatedUnit.save();
  } catch (err) {
    throw err;
  }
});

module.exports = mongoose.model('Post', postSchema);
