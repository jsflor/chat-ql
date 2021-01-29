const {UserInputError, AuthenticationError, withFilter} = require('apollo-server');
const {Op} = require('sequelize');

const {Message, User} = require('../../models');

module.exports = {
    Query: {
        getMessages: async (parent, {from}, {user}) => {
            try {
                if (!user) throw new AuthenticationError('UNAUTHENTICATED');

                const otherUser = await User.findOne({where: {username: from}});

                if (!otherUser) throw new UserInputError('User not found');

                const usernames = [user.username, otherUser.username];

                return await Message.findAll({
                    where: {
                        from: {[Op.in]: usernames},
                        to: {[Op.in]: usernames},
                    },
                    order: [['createdAt', 'DESC']]
                });

            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    },
    Mutation: {
        sendMessage: async (parent, {to, content}, {user, pubSub}) => {
            try {
                if (!user) throw new AuthenticationError('UNAUTHENTICATED');

                const recipient = await User.findOne({ where: { username: to }});

                if (!recipient) {
                    throw new UserInputError('User not found');
                } else if (recipient.username === user.username) {
                    throw new UserInputError('You cant message yourself');
                }

                if (content.trim() === '') {
                    throw new UserInputError('Message is empty');
                }

                const message =  await Message.create({
                    from: user.username,
                    to,
                    content
                });

                pubSub.publish('NEW_MESSAGE', {newMessage: message});

                return message;

            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    },
    Subscription: {
        newMessage: {
            subscribe: withFilter((_, __, {pubSub, user}) => {
                if (!user) throw new AuthenticationError('UNAUTHENTICATED');
                return pubSub.asyncIterator(['NEW_MESSAGE']);
            }, ({newMessage}, _, {user}) => {
                return newMessage.from === user.username || newMessage.to === user.username;
            })
        }
    }
};
