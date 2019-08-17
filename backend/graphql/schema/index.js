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
    _id: ID!
    name: String!
    surname: String! 
    patronymic: String!
    dateOfBirth: String
    position: Position!
  }
  
  type User {
    _id: ID!
    login: String!
    password: String!
    employee: Employee!
  }
  
  type AuthData {
    userId: ID!
    token: String!
  }
  
  type RootQuery {
    position(name: String!): Position
    positions: [Position!]!
    employees: [Employee!]!
    users: [User!]!
    login(login: String!, password: String!): AuthData
  }
  
  schema {
    query: RootQuery
  }
`);