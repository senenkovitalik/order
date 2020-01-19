const Position = require('../../models/Position');

module.exports = {
  Position: {
    juniorPositions: async (parent) => {
      try {
        return await Position.find({
          _id: {
            $in: parent.juniorPositions
          }
        });
      } catch (error) {
        return error;
      }
    }
  }
};