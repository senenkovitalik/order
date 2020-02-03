const Duty = require('../../models/Duty');

module.exports = {
  Post: {
    /*
     month (from 0-11)
     day (from 1-31)
     year & month - find for month
     year & month & day - find for day
     */
    duties: async (parent, { year, month, day }) => {
      return await Duty.find({
        _id: {
          $in: parent.duties
        },
        date: day ? `${year}-${month + 1}-${day}` : {
          $gte: `${year}-${month + 1}-${day ? day : 1}`,
          $lte: `${year}-${month + 2}-${day ? day : 1}`
        }
      });
    }
  }
};
