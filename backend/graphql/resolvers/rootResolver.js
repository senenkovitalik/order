const {positionQueries} = require('./positionsResolver');
const {employeeQuery, employeeMutation} = require('./employeesResolver');
const {userQuery} = require('./usersResolver');
const {unitQuery, unitMutation} = require('./unitResolver');
const {rankQuery} = require('./rankResolver');
const {addressMutation} = require('./addressResolver');
const {postMutation} = require('./postResolver');
const {dutyQuery, dutyMutation} = require('./dutyResolver');

module.exports = {
  Query: {
    ...positionQueries,
    ...employeeQuery,
    ...userQuery,
    ...unitQuery,
    ...rankQuery,
    ...dutyQuery
  },
  Mutation: {
    ...employeeMutation,
    ...unitMutation,
    ...addressMutation,
    ...postMutation,
    ...dutyMutation
  }
};
