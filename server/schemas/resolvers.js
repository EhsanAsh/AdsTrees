// Desc: This file contains the graphql resolvers for the AdsTrees application.
// ==================================================================

// Dependencies
// ==================================================================
const { GraphQLError } = require('graphql');
const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
// ==================================================================

// Define the resolvers
// ==================================================================
const resolvers = {
    Query: {
        users: async () => {

            try {
                return await User.find();
            } catch (err) {
                throw new GraphQLError(`Failed to fetch users: ${err.message}`, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                });
            }
        },

        user: async (parent, { username }) => {

            try {
                return await User.findOne({ username }).populate('preferences');
            } catch (err) {
                throw new GraphQLError(`Failed to fetch user: ${err.message}`, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                });
            }
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {

            try {
                const user = await User.create({ username, email, password });
                const token = signToken(user);
                return { token, user };
            } catch (err) {
                throw new GraphQLError(`Failed to create user: ${err.message}`, {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                });
            }
        },

        login: async (parent, { email, password }) => {

            const user = await User.findOne({ email });

            if (!user) {
                throw AuthenticationError;
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw AuthenticationError;
            }

            const token = signToken(user);

            return { token, user };
        },

    },
};
// ==================================================================

// Export the resolvers
// ==================================================================
module.exports = resolvers;
// ==================================================================