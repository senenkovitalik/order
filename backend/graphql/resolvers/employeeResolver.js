const Rank = require('../../models/Rank');
const Position = require('../../models/Position');

module.exports = {
  Employee: {
    rank: async (parent) => {
      try {
        return await Rank.findById(parent.rank);
      } catch (error) {
        throw error;
      }
    },
    position: async parent => {
      try {
        return await Position.findById(parent.position);
      } catch (error) {
        throw error;
      }
    }
  }
};