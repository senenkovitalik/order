const mongoose = require('mongoose');
const MonthDuties = require('../../models/MonthDuties');

module.exports = {
  /* CREATE */
  saveMonthDuties: async ({monthDutiesInput}, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized');
    }
    try {
      const {duties, ...filter} = monthDutiesInput;
      return await MonthDuties.findOneAndUpdate(filter, monthDutiesInput, {new: true, upsert: true, lean: true}).exec();
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
      return await MonthDuties.find(args).exec();
    } catch (err) {
      console.log(err);
    }
  }
};
