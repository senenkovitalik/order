const positionResolver = require('./positionsResolver');
const employeeResolver = require('./employeesResolver');

module.exports = {
  ...positionResolver,
  ...employeeResolver
};