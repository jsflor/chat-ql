const userResolvers = require('./userResolvers');
const messageResolvers = require('./messageResolvers');

const {Message, User, Reaction} = require('../../models');

module.exports = {
    User: {
        createdAt: (parent) => parent.createdAt.toISOString(),
    },
    Message: {
        createdAt: (parent) => parent.createdAt.toISOString(),
    },
    Reaction: {
        createdAt: (parent) => parent.createdAt.toISOString(),
        Message: async (parent) => await Message.findByPk(parent.messageId),
        User: async (parent) => await User.findByPk(parent.userId, {
            attributes: ['username', 'imageUrl', 'createdAt']
        }),
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
