const Unit = require('../../models/Unit');

module.exports = {
  unit: async ({id}, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized');
    }
    try {
      return await Unit.findById(id)
        .populate({
          path: 'head employees parentUnit',
          populate: {path: 'position rank head'}
        })
        .exec();
    } catch (err) {
      throw err;
    }
  },
  units: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized');
    }
    try {
      return await Unit.find()
        .populate('head employees')
        .exec();
    } catch (err) {
      throw err;
    }
  }
};

