const Address = require('../../models/Address');

module.exports = {
  addressMutation: {
    updateAddress: async ({id: _id, data}) => {
      try {
        return await Address.findOneAndUpdate({_id}, data, {runValidators: true}, () => {});
      } catch (err) {
        throw err;
      }
    }
  }
};