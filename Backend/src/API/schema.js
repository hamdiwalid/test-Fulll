const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Location {
    lat: Float!
    lng: Float!
    alt: Float
  }

  type Vehicle {
    plateNumber: String!
    location: Location
  }

  type Fleet {
    id: ID!
    userId: String!
    vehicles: [Vehicle!]!
  }

  type Query {
    fleetVehicles(fleetId: ID!): [Vehicle!]!
    vehicleLocation(fleetId: ID!, plateNumber: String!): Location
  }

  type Mutation {
    createFleet(userId: String!): ID!
    registerVehicle(fleetId: ID!, plateNumber: String!): Boolean!
    parkVehicle(
      fleetId: ID!
      plateNumber: String!
      lat: Float!
      lng: Float!
      alt: Float
    ): Boolean!
  }
`;

module.exports = typeDefs;
