const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  userQuery: {
    user: async ({userId}, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }
      try {
        return await User.findById(userId)
          .populate({
            path: 'employee',
            populate: {path: 'position'}
          })
          .exec();
      } catch (err) {
        throw err;
      }
    },
    userByToken: async (args, req) => {
      if (!req.isAuth && !req.userId) {
        throw new Error('Unauthorized');
      }
      try {
        return await User.findById(req.userId)
          .populate({
            path: 'employee',
            populate: {path: 'unit'}
          })
          .exec();
      } catch (err) {
        throw err;
      }
    },
    users: async (args, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }
      try {
        return await User.find()
          .populate({
            path: 'employee',
            populate: {path: 'position'}
          }).exec();
      } catch (err) {
        throw err;
      }
    },
    login: async ({login, password}) => {
      const user = await User.findOne({login}).populate({
        path: 'employee',
        populate: {path: 'unit'}
      }).exec();
      if (!user) {
        throw new Error('User doesn\'t exist!');
      }

      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error('Password is incorrect!');
      }

      const token = jwt.sign(
        {userId: user._id, login: user.login},
        process.env.JWT_PASSWORD
      );

      return {
        user,
        token
      };
    }
  }
};