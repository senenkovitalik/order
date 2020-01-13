const Duty = require('../../models/Duty');

module.exports = {
  Post: {
    // month (from 0-11)
    // day (from 1-31)
    duties: async (parent, { year, month, day }) => {
      const startDate = new Date(year, month, day ? day : 1);
      const endDate = new Date(year, day ? month : month + 1, day ? day : 1);

      return await Duty.find({
        _id: {
          $in: parent.duties
        },
        date: day ? startDate.toISOString() : {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString()
        }
      });
    }
  }
};
