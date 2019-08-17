const positionResolver = require('./positionsResolver');
const employeeResolver = require('./employeesResolver');
const userResolver = require('./usersResolver');
const unitResolver = require('./unitResolver');

module.exports = {
  ...positionResolver,
  ...employeeResolver,
  ...userResolver,
  ...unitResolver
};
