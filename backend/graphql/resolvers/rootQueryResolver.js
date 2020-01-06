const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Unit = require('../../models/Unit');
const Post = require('../../models/Post');

module.exports = {
  Query: {
    login: async (_, {login, password}) => {
      let user;
      try {
        user = await User.findOne({login});
      } catch (error) {
        console.log(error);
        throw error;
      }

      if (!user) {
        throw new Error('User doesn\'t exist!');
      }

      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error('Password is incorrect!');
      }

      const credentials = {
        userId: user._id,
        login: user.login
      };
      const token = jwt.sign(credentials, process.env.JWT_PASSWORD);

      return {
        user,
        token
      };
    },
    unit: async (_, {id}, req) => {
      // if (!req.isAuth) {
      //   throw new Error('Unauthorized');
      // }
      try {
        return await Unit.findById(id);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    post: async (_, {id}, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }
      try {
        return await Post.findById(id);
      } catch (error) {
        throw error;
      }
    }
  }
};