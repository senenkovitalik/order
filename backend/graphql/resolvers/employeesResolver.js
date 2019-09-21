const Employee = require('../../models/Employee');
const Address = require('../../models/Address');

module.exports = {
  /* CREATE */
  createEmployee: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized');
    }

    const {employee, addressOfResidence, registrationAddress} = args;

    try {
      const residenceAddr = new Address(addressOfResidence);
      const residenceAddrDoc = await residenceAddr.save();
      employee.addressOfResidence = residenceAddrDoc._id;

      const registrationAddr = new Address(registrationAddress);
      const registrationAddrDoc = await registrationAddr.save();
      employee.registrationAddress = registrationAddrDoc._id;

      const newEmployee = new Employee(employee);
      const newEmployeeDoc = await newEmployee.save();
      return await Employee.findById(newEmployeeDoc._id);
    } catch (err) {
      console.log(err);
    }
  },

  /* GET */
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

  /* UPDATE */
  updateEmployee: async ({id: _id, data, addressOfResidence, registrationAddress}, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized');
    }

    const saveData = data ? data : {};
    const opts = {
      new: true,
      runValidators: true
    };

    try {
      if (addressOfResidence) {
        const {_id, ...rest} = addressOfResidence;
        let residence;

        if (_id) {
          residence = await Address.findByIdAndUpdate(_id, rest, opts).exec();
        } else {
          const address = new Address(rest);
          residence = await address.save();
        }

        saveData.addressOfResidence = residence._id;
      }

      if (registrationAddress) {
        const {_id, ...rest} = registrationAddress;
        let registration;

        if (_id) {
          registration = await Address.findByIdAndUpdate(_id, rest, opts).exec();
        } else {
          const address = new Address(rest);
          registration = await address.save();
        }

        saveData.registrationAddress = registration._id;
      }

      return await Employee.findByIdAndUpdate(_id, saveData, opts).exec();
    } catch (err) {
      throw err;
    }
  },

  /* DELETE */
  deleteEmployee: async ({id}, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized');
    }

    try {
      const employee = await Employee.findById(id).exec();
      return await employee.remove();
    } catch (err) {
      throw err;
    }
  }
};