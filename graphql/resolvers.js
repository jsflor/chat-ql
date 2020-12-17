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
};
