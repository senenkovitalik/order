const {buildSchema} = require('graphql');

module.exports = buildSchema(`
  type Position {
    _id: ID!
    name: String!
    shortName: String!
    seniorPosition: Position
    juniorPositions: [Position]
  }
  
  type Employee {
    name: String!
    surname: String! 
    patronymic: String!
    dateOfBirth: String
    position: Position!
  }
  
  type RootQuery {
    position(name: String!): Position
    positions: [Position!]!
    employees: [Employee!]!
  }
  
  schema {
    query: RootQuery
  }
`);