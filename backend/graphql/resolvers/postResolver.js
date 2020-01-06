const Duty = require('../../models/Duty');

module.exports = {
  Post: {
    duties: async (parent, {year, month}) => {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      const startDateFormatted = startDate.toISOString().split('T')[0];
      const endDateFormatted = endDate.toISOString().split('T')[0];
      return await Duty.find({
        _id: {
          $in: parent.duties
        },
        date: {
          $gte: startDateFormatted,
          $lte: endDateFormatted
        }
      });
    }
  }
};
