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
    type: String
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
    posts: [Post!]!
  }
  
  type Post {
    _id: ID!
    name: String!
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
  
  type Duty {
    _id: ID!
    day: Int!
    employee: Employee!
    type: String!
  }
  
  type MonthDuties {
    _id: ID!
    year: Int!
    month: Int!
    unit: Unit!
    post: Post!
    duties: [Duty!]!
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
    rank: ID!
    position: ID!
    unit: ID!
  }
  
  input DutyInput {
    day: Int!
    employee: ID!
    type: String!
  }
  
  input MonthDutiesInput {
    year: Int!
    month: Int!
    post: ID!
    unit: ID!
    duties: [DutyInput!]!
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
    unit(id: ID!): Unit
    login(login: String!, password: String!): AuthData
    monthDuties(year: Int!, month: Int!, post: ID!): MonthDuties
  }
  
  type RootMutation {
    createEmployee(employee: EmployeeInput!, addressOfResidence: AddressInput, registrationAddress: AddressInput): Employee!
    updateEmployee(id: ID!, data: EmployeeInput, addressOfResidence: AddressInput, registrationAddress: AddressInput): Employee!
    updateAddress(id: ID!, data: AddressInput!): Address!
    deleteEmployee(id: ID!): Employee!
    createPost(unitId: ID!, postName: String!): Post!
    deletePost(id: ID!): Post!
    saveMonthDuties(monthDutiesInput: MonthDutiesInput!): MonthDuties!
  }
  
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);