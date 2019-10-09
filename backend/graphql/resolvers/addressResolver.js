const Address = require('../../models/Address');

module.exports = {
  updateAddress: async ({ id: _id, data }) => {
    try {
      return await Address.findOneAndUpdate({ _id }, data, { runValidators: true }, () => {});
    } catch (err) {
      throw err;
    }
  }
};