const mongoose = require('mongoose');
const MonthDuties = require('../../models/MonthDuties');

module.exports = {
  /* CREATE */
  saveMonthDuties: async ({monthDutiesInput}, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized');
    }
    try {
      const model = new MonthDuties({...monthDutiesInput});
      return await model.save();
    } catch (err) {
      console.log(err);
    }
  },

  /* READ */
  monthDuties: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized');
    }
    try {
      return await MonthDuties.findOne(args).exec();
    } catch (err) {
      console.log(err);
    }
  }
};
