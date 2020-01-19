const rootQueryResolver = require('./rootQueryResolver');
const unitResolver = require('./unitResolver');
const employeeResolver = require('./employeeResolver');
const postResolver = require('./postResolver');
const positionResolver = require('./positionsResolver');

module.exports = {
  ...rootQueryResolver,
  ...unitResolver,
  ...employeeResolver,
  ...postResolver,
  ...positionResolver
};
