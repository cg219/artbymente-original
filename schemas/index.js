const { buildSchema } = require('graphql');
const Schema = buildSchema(`
  type User {
    username: String
  }

  type UserError {
    code: String
    message: String
  }

  type UserResponse {
    user: User
    error: UserError
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
  }

  input ArtInput {
    title: String!
    description: String
    listingId: String
    slug: String!
    canBuy: Boolean
  }

  type Image {
    url: String
  }

  type Query {
    getUser(input: UserInput): User
  }

  type Mutation {
    createUser(input: UserInput): UserResponse
  }

  schema {
    query: Query
    mutation: Mutation
  }
`)

module.exports = Schema;