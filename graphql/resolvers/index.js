const userResolvers = require('./userResolvers');
const messageResolvers = require('./messageResolvers');

module.exports = {
    User: {
        createdAt: (parent) => parent.createdAt.toISOString(),
    },
    Message: {
        createdAt: (parent) => parent.createdAt.toISOString(),
    },
    Query: {
        ...userResolvers.Query,
        ...messageResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...messageResolvers.Mutation
    },
    Subscription: {
        ...messageResolvers.Subscription
    }
};
