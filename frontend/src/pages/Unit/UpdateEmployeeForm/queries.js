import { gql } from 'apollo-boost';

export const RANKS = gql`
  query Ranks {
    ranks {
      _id
      index
      name
    }
  }`;

export const POSITIONS = gql`
  query Position($id: ID!) {
    position(_id: $id) {
      juniorPositions {
        _id
        name
      }
    }
  }
`;
