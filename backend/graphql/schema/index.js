const {buildSchema} = require('graphql');

module.exports = buildSchema(`
  type Rank {
    _id: ID!
    index: Int!
    name: String!
    shortName: String!
  }
   
  type Position {
    _id: ID!
    name: String!
    shortName: String!
    seniorPosition: Position
    juniorPositions: [Position]!
  }
  
  type Address {
    _id: ID!
    region: String
    district: String
    city: String
    village: String
    urbanVillage: String
    street: String
    houseNumber: String
    apartmentNumber: String
  }
  
  type Employee {
    _id: ID!
    name: String!
    surname: String! 
    patronymic: String!
    dateOfBirth: String!
    addressOfResidence: Address
    registrationAddress: Address
    rank: Rank!
    position: Position!
    type: String!
    unit: Unit!
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
    employee: Employee!
  }
  
  input AddressInput {
    _id: ID
    region: String
    district: String
    city: String
    village: String
    urbanVillage: String
    street: String
    houseNumber: String
    apartmentNumber: String
  }
  
  input EmployeeInput {
    name: String
    surname: String 
    patronymic: String
    dateOfBirth: String
    addressOfResidence: ID
    registrationAddress: ID
    rank: ID
    position: ID
    unit: ID
  }
  
  type RootQuery {
    ranks: [Rank!]!
    rank(id: String!): Rank
    position(name: String!): Position
    positions: [Position!]!
    employees: [Employee!]!
    employee(id: String!): Employee
    users: [User!]!
    user(userId: String!): User
    userByToken: User!
    units: [Unit!]!
    unit(id: String!): Unit
    login(login: String!, password: String!): AuthData
  }
  
  type RootMutation {
    updateEmployee(id: ID!, data: EmployeeInput, addressOfResidence: AddressInput, registrationAddress: AddressInput): Employee!
    updateAddress(id: ID!, data: AddressInput!): Address!
  }
  
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);