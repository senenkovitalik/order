const Unit = require('../../models/Unit');

module.exports = {
  unit: async ({id}) => {
    try {
      return await Unit.findById(id)
        .populate({
          path: 'head employees',
          populate: {path: 'position rank'}
        })
        .exec();
    } catch (err) {
      throw err;
    }
  },
  units: async () => {
    try {
      return await Unit.find()
        .populate('head employees')
        .exec();
    } catch (err) {
      throw err;
    }
  }
};

