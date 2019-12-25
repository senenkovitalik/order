const Position = require('../../models/Position');

module.exports = {
  positionQueries: {
    position: async ({_id}) => {
      try {
        return await Position.findById(_id).populate([
          {
            path: 'juniorPositions',
            model: 'Position'
          },
          {
            path: 'seniorPosition',
            model: 'Position'
          }
        ]).exec();
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
  }
};