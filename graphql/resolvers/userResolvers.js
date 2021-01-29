const {UserInputError, AuthenticationError} = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Op} = require('sequelize');

const {User, Message} = require('../../models');
const {JWT_SECRET} = require('../../config/env.json');

module.exports = {
    Query: {
        getUsers: async (_, __, {user}) => {
            try {
                if (!user) throw new AuthenticationError('UNAUTHENTICATED');

                const users = await User.findAll({
                    attributes: ['username', 'imageUrl', 'createdAt'],
                    where: {
                        username: {
                            [Op.ne]: user.username
                        }
                    }
                });

                const allUserMessages = await Message.findAll({
                    where: {
                        [Op.or]: [{from: user.username}, {to: user.username}]
                    },
                    order: [['createdAt', 'DESC']]
                });

                return users.map((otherUser) => {
                    otherUser.latestMessage = allUserMessages.find((m) => m.from === otherUser.username
                        || m.to === otherUser.username);
                    return otherUser;
                });
            } catch (err) {
                console.log(err);
                throw err;
            }
        },
    },
    Mutation: {
        register: async (_, args) => {
            let {username, email, password, confirmPassword} = args;
            let errors = {};

            try {
                // VALIDATE INPUT DATA
                if (username.trim() === '') errors.username = 'Username must not be empty';
                if (email.trim() === '') errors.email = 'Email must not be empty';
                if (password.trim() === '') errors.password = 'Password must not be empty';
                if (confirmPassword.trim() === '') errors.confirmPassword = 'Repeat Password must not be empty';
                if (password !== confirmPassword) errors.confirmPassword = 'Passwords must match';

                // CHECK USERNAME / EMAIL EXIST
                // const userByUsername = await User.findOne({where: {username}});
                // const userByEmail = await User.findOne({where: {email}});
                //
                // if (userByUsername) errors.username = 'Username is already taken';
                // if (userByEmail) errors.email = 'Email is already taken';

                if (Object.keys(errors).length > 0){
                    throw errors;
                }

                // HASH PASSWORD
                password = await bcrypt.hash(password, 6);
                // CREATE USER & RETURN USER
                const user = await User.create({username, email, password});

                const token = jwt.sign({
                    username
                }, JWT_SECRET, {
                    expiresIn: '6h'
                });

                return {
                    ...user.toJSON(),
                    token
                };
            } catch (err) {
                console.log(err);
                if (err.name === 'SequelizeUniqueConstraintError') {
                    err.errors.forEach(e => (errors[e.path] = `${e.path} is already taken`));
                } else if (err.name === 'SequelizeValidationError') {
                    err.errors.forEach(e => (errors[e.path] = `${e.path} ${e.message}`));
                }
                throw new UserInputError('Bad input', {errors: err});
            }
        },
        login: async (_, args) => {
            const {username, password} = args;
            const errors = {};

            try {
                if (username.trim() === '') errors.username = 'Username must not be empty';
                if (password === '') errors.password = 'Password must not be empty';

                if (Object.keys(errors).length > 0) {
                    throw new UserInputError('Bad input', {errors});
                }

                const user = await User.findOne({
                    where: {
                        username
                    }
                });

                if (!user) {
                    errors.username = 'User not found';
                    throw new UserInputError('User not found', {errors});
                }

                const correctPassword = await bcrypt.compare(password, user.password);

                if (!correctPassword) {
                    errors.password = 'Incorrect password';
                    throw new UserInputError('Incorrect password', {errors});
                }

                const token = jwt.sign({
                    username
                }, JWT_SECRET, {
                    expiresIn: '6h'
                });

                return {
                    ...user.toJSON(),
                    token
                };
            } catch (err) {
                console.log(err);
                throw err;
            }
        }
    }
};
