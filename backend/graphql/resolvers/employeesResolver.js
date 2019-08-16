const Employee = require('../../models/Employee');

module.exports = {
  employees: async () => {
    try {
      const employees = await Employee.find().populate('position');
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
  }
};