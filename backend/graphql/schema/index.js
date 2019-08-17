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
  
  type Unit {
    _id: ID!
    name: String!
    shortName: String!
    parentUnit: Unit
    childUnits: [Unit!]!
    head: Employee!
    employees: [Employee!]!
  }
  
  type User {
    _id: ID!
    login: String!
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
    employee(id: String!): Employee
    users: [User!]!
    user(userId: String!): User
    units: [Unit!]!
    unit(id: String!): Unit
    login(login: String!, password: String!): AuthData
  }
  
  schema {
    query: RootQuery
  }
`);