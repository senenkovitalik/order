const Rank = require('../../models/Rank');

module.exports = {
  Employee: {
    rank: async (parent) => {
      try {
        return await Rank.findById(parent.rank);
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  }
};