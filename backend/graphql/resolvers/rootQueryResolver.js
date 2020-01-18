const mongoose = require('mongoose');
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
        const duties = await Duty.find({ post: id });
        const post = await Post.findById(id);
        return Object.assign({}, post._doc, { duties: duties.map(({ _id }) => _id) });
      } catch (error) {
        throw error;
      }
    },
    dutyExistence: async (_, { postId: _id }, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }

      try {
        const duties = await Duty.find({ post: _id });
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
    saveDuties: async (_, { postId, duties, year, month, day }, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }

      try {
        // remove all duties by postId, year, month
        const startDate = new Date(year, month, day ? day : 1);
        const endDate = new Date(year, day ? month : month + 1, day ? day : 1);
        await Duty.deleteMany({
          date: day
            ? startDate.toISOString()
            : {
              $gte: startDate.toISOString(),
              $lte: endDate.toISOString()
            }
        });

        const post = await Post.findById(postId);

        // save
        const newDuties = !!duties.length
          ? await Duty.create(duties.map(duty => ({ ...duty, post: postId })))
          : [];

        return Object.assign({}, post._doc, { duties: newDuties });
      } catch (error) {
        return error;
      }
    },
    createPost: async (_, { unitId, post }, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }

      try {
        const createdPost = await Post.create(post);

        // add Post ID to Unit.posts
        const unit = await Unit.findById(unitId);
        unit.posts = unit.posts.concat([createdPost._id]);
        await unit.save();

        return createdPost;
      } catch (error) {
        return error;
      }
    },
    deletePost: async (_, { unitId, postId }, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }

      try {
        // delete Post
        const deletedPost = await Post.findByIdAndDelete(postId);

        // delete all post Duties
        await Duty.deleteMany({ post: postId });

        // delete Post ID from Unit.posts
        const unit = await Unit.findById(unitId);
        unit.posts = unit.posts.filter(id => !id.equals(mongoose.Types.ObjectId(postId)));
        await unit.save();

        return deletedPost;
      } catch (error) {
        return error;
      }
    },
    createUnit: async (_, { parentUnitId, unit }, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }

      try {
        const parentUnit = await Unit.findById(parentUnitId);

        if (!parentUnit) {
          return new Error(`Unit ${parentUnitId} couldn't be found`);
        }

        const createdUnit = await Unit.create({...unit, parentUnit: parentUnitId});

        // add Unit ID to parent Unit.childUnits
        parentUnit.childUnits = parentUnit.childUnits.concat([createdUnit._id]);
        await parentUnit.save();

        return createdUnit;
      } catch (error) {
        return error;
      }
    },
    deleteUnit: async (_, {id}, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }

      try {
        const unitToDelete = await Unit.findById(id);

        if (!unitToDelete) {
          return new Error(`Unit ${id} couldn't be found`);
        }

        // delete Unit _id from parentUnit.childUnits
        const parentUnit = await Unit.findById(unitToDelete.parentUnit);

        if (!parentUnit) {
          return new Error(`Unit ${id} doesn't have parent Unit`)
        }

        parentUnit.childUnits = parentUnit.childUnits.filter(childUnitId => !childUnitId.equals(mongoose.Types.ObjectId(id)));
        await parentUnit.save();

        // delete Unit
        await unitToDelete.deleteOne();

        return unitToDelete;
      } catch (error) {
        return error;
      }
    }
  }
};