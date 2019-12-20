import { gql } from 'apollo-boost';

export const RANKS = gql`
  query Ranks {
    ranks {
      _id
      index
      name
    }
  }`;
