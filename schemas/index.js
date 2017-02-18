const { buildSchema } = require('graphql');
const CustomType = require('./../types');
const { makeExecutableSchema } = require('graphql-tools');
const Schema = `
  scalar Date

  type User {
    username: String
  }

  input UserInput {
    username: String
    password: String
  }

  type Art {
    title: String!
    description: String
    slug: String!
    listingId: String
    thumbnail: Image
    images: [Image]
    canBuy: Boolean
    created: Date
  }

  input ArtInput {
    title: String!
    description: String
    listingId: String
    slug: String!
    canBuy: Boolean
    created: Date!
    thumbnail: String
    images: [String]
    updatedSlug: String
  }

  type Image {
    url: String
  }

  type Query {
    getUser(input: UserInput): User
  }

  type Mutation {
    createUser(input: UserInput): User
    createArt(input: ArtInput): Art
    updateArt(input: ArtInput): Art
    createImage(url: String): Image
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
const resolvers = {
  Date: CustomType.DateType()
}

module.exports = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: resolvers
});