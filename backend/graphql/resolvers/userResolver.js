const Employee = require('../../models/Employee')

module.exports = {
    User: {
      employee: async (parent, {id}, req) => {
        try {
          return await Employee.findById(parent.employee);
        } catch (err) {
          throw err;
        }
      },
    }
};