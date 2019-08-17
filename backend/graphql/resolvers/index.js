const positionResolver = require('./positionsResolver');
const employeeResolver = require('./employeesResolver');
const userResolver = require('./usersResolver');

module.exports = {
  ...positionResolver,
  ...employeeResolver,
  ...userResolver
};
