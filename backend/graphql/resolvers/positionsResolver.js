const Position = require('../../models/Position');

module.exports = {
  position: async ({ name }) => {
    try {
      return await Position
        .findOne({shortName: name})
        .exec();
    } catch (err) {
      throw err;
    }
  },
  positions: async () => {
    try {
      return await Position.find().exec();
    } catch (err) {
      throw err;
    }
  }
};