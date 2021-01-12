const {gql} = require("apollo-server");

module.exports = gql`
    type User {
        username: String!
        email: String
        createdAt: String!
        token: String
        imageUrl: String!
        latestMessage: Message
    }
    type Message {
        uuid: String!
        content: String!
        from: String!
        to: String!
        createdAt: String!
    }
    type Query {
        getUsers: [User]!
        getMessages(from: String!): [Message]!
    }
    type Mutation {
        register(
            username: String!
            email: String!
            password: String!
            confirmPassword: String!
        ): User!
        login(
            username: String!
            password: String!
        ): User!
        sendMessage(
            to: String!
            content: String!
        ): Message!
    }
`;
