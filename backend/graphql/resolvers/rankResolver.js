const mongoose = require('mongoose');
const Rank = require('../../models/Rank');

module.exports = {
  rank: async ({id}) => {
    try {
      return await Rank.findById(id);
    } catch (err) {
      throw err;
    }
  },
  ranks: async () => {
    try {
      return await Rank.find();
    } catch (err) {
      throw err;
    }
  }
};
