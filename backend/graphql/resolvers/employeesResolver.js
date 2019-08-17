const Employee = require('../../models/Employee');

module.exports = {
  employee: async ({id}) => {
    try {
      return await Employee.findById(id)
        .populate('position')
        .exec();
    } catch (err) {
      throw err;
    }
  },
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