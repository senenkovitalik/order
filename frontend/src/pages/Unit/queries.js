import { gql } from 'apollo-boost';

export const CREATE_UNIT = gql`
  mutation CreateUnit(
    $name: String!,
    $shortName: String!,
    $head: ID!
  ) {
    unit {
      name
    }
  }
`;

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee(
    $employee: EmployeeInput!,
    $addressOfResidence: AddressInput,
    $registrationAddress: AddressInput
  ) {
    createEmployee(
      employee: $employee,
      addressOfResidence: $addressOfResidence,
      registrationAddress: $registrationAddress
    ) {
      _id
      rank {
        _id
        index
        name
        shortName
      }
      position {
        name
        shortName
      }
      name
      surname
      patronymic
      dateOfBirth
      addressOfResidence {
        region
        district
        city
        village
        urbanVillage
        street
        houseNumber
        apartmentNumber
      }
      registrationAddress {
        region
        district
        city
        village
        urbanVillage
        street
        houseNumber
        apartmentNumber
      }
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id) {
      _id
    }
  }
`;

export const ADD_POST = gql`
  mutation CreatePost($unitId: ID!, $postName:String!) {
    createPost(unitId: $unitId, postName: $postName) {
      _id
      name
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      _id
    }
  }
`;
