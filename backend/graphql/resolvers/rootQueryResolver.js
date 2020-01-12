const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Unit = require('../../models/Unit');
const Post = require('../../models/Post');
const Duty = require('../../models/Duty');

module.exports = {
  Query: {
    login: async (_, { login, password }) => {
      let user;
      try {
        user = await User.findOne({ login });
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
    unit: async (_, { id }, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }
      try {
        return await Unit.findById(id);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    post: async (_, { id }, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }
      try {
        return await Post.findById(id);
      } catch (error) {
        throw error;
      }
    },
    dutyExistence: async (_, { postId: _id }) => {
      try {
        const post = await Post.findById(_id);
        const duties = await Duty.find({ _id: { $in: post.duties } });
        return duties
          .map(({ date }) => ({
            year: date.getFullYear(),
            month: date.getMonth()
          }))
          .reduce((accumulator, currentValue) => {
            const isContain = accumulator.find(item => item.year === currentValue.year && item.month === currentValue.month);
            return isContain
              ? accumulator
              : accumulator.concat([currentValue]);
          }, []);
      } catch (error) {
        return error;
      }
    },
  },
  Mutation: {
    saveDuties: async (_, { postId: _id, duties }) => {
      try {
        let post;
        // always remove all duties (by post and date) from duties collection and Post.duties
        post = await Post.findOneAndUpdate({ _id }, { duties: [] }, { new: false });
        await Duty.deleteMany({ _id: { $in: post.duties.map(({ _id }) => _id) } });

        // save
        if (!!duties.length) {
          const result = await Duty.create(duties);
          const dutyIds = result.map(duty => duty._id);
          post = await Post.findOneAndUpdate({ _id }, { duties: dutyIds }, { new: true });
        }

        return post;
      } catch (error) {
        return error;
      }
    }
  }
};