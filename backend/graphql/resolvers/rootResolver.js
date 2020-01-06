const rootQueryResolver = require('./rootQueryResolver');
const userResolver = require('./userResolver');
const unitResolver = require('./unitResolver');
const employeeResolver = require('./employeeResolver');
const postResolver = require('./postResolver');

module.exports = {
  ...rootQueryResolver,
  ...userResolver,
  ...unitResolver,
  ...employeeResolver,
  ...postResolver
};
