const positionResolver = require('./positionsResolver');
const employeeResolver = require('./employeesResolver');
const userResolver = require('./usersResolver');
const unitResolver = require('./unitResolver');
const rankResolver = require('./rankResolver');
const addressResolver = require('./addressResolver');
const postResolver = require('./postResolver');

module.exports = {
  ...positionResolver,
  ...employeeResolver,
  ...userResolver,
  ...unitResolver,
  ...rankResolver,
  ...addressResolver,
  ...postResolver,
};
