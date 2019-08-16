const {buildSchema} = require('graphql');

module.exports = buildSchema(`
  type Position {
    _id: ID!
    name: String!
    shortName: String!
    seniorPosition: Position
    juniorPositions: [Position]
  }
  
  type RootQuery {
    position(name: String!): Position
    positions: [Position!]!
  }
  
  schema {
    query: RootQuery
  }
`);