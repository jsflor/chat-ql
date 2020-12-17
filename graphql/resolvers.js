const {UserInputError} = require('apollo-server');
const bcrypt = require('bcryptjs');

const {User} = require('../models');

module .exports = {
    Query: {
        getUsers: async () => {
            try {
                return await User.findAll();
            } catch (err) {
                console.log(err);
            }
        },
    },
    Mutation: {
        register: async (_, args, context, info) => {
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
                return await User.create({username, email, password});
            } catch (err) {
                console.log(err);
                if (err.name === 'SequelizeUniqueConstraintError') {
                    err.errors.forEach(e => (errors[e.path] = `${e.path} is already taken`));
                } else if (err.name === 'SequelizeValidationError') {
                    err.errors.forEach(e => (errors[e.path] = `${e.path} ${e.message}`));
                }
                throw new UserInputError('Bad input', {errors: err});
            }
        }
    }
};
