const Employee = require('../../models/Employee');

module.exports = {
  employee: async ({id}, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized');
    }
    try {
      const employee = await Employee.findById(id).populate('position rank addressOfResidence registrationAddress').exec();
      return Object.assign({}, employee._doc, { dateOfBirth: new Date(employee._doc.dateOfBirth).toLocaleDateString()})
    } catch (err) {
      throw err;
    }
  },
  employees: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized');
    }
    try {
      const employees = await Employee.find().populate('position rank addressOfResidence registrationAddress');
      return employees.map(employee => {
        const {dateOfBirth, ...rest} = employee._doc;
        return {
          dateOfBirth: new Date(dateOfBirth).toLocaleDateString(),
          ...rest
        }
      });
    } catch (err) {
      throw err;
    }
  },
  updateEmployee: async ({id: _id, data}) => {
    try {
      return await Employee.findOneAndUpdate({_id}, data, {runValidators: true}, () => {});
    } catch (err) {
      throw err;
    }
  }
};