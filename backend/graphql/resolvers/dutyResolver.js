const Employee = require('../../models/Employee');

module.exports = {
  Duty: {
    employee: async (parent) => {
      return await Employee.findById(parent.employee);
    }
  }
};