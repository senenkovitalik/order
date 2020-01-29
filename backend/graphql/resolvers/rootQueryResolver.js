const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Unit = require('../../models/Unit');
const Post = require('../../models/Post');
const Duty = require('../../models/Duty');
const Rank = require('../../models/Rank');
const Position = require('../../models/Position');
const Employee = require('../../models/Employee');

module.exports = {
  Query: {
    login: async (_, { login, password }) => {
      try {
        const user = await User.findOne({ login });
        if (!user) {
          return new Error('User doesn\'t exist!');
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
          return new Error('Password is incorrect!');
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
      } catch (error) {
        throw error;
      }
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
    ranks: async () => {
      try {
        return await Rank.find();
      } catch (error) {
        return error;
      }
    },
    position: async (_, { id }) => {
      try {
        return await Position.findById(id);
      } catch (error) {
        return error;
      }
    }
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
          post: postId,
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
    // Post
    createPost: async (_, { unitID, postData }, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }

      try {
        // find unit
        const unit = await Unit.findById(unitID);
        if (!unit) {
          return new Error(`Can't find Unit ${unitID}`);
        }

        const createdPost = await Post.create(postData);

        // add Post ID to Unit.posts
        unit.posts = unit.posts.concat([createdPost._id]);
        await unit.save();

        return createdPost;
      } catch (error) {
        return error;
      }
    },
    updatePost: async (_, { postID, postData }, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }

      try {
        return await Post.findByIdAndUpdate(postID, postData, { new: true });
      } catch (error) {
        return error;
      }
    },
    deletePost: async (_, { unitID, postID }, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }

      try {
        // find unit
        const unit = await Unit.findById(unitID);
        if (!unit) {
          return new Error(`Can't find Unit ${unitID} for Post ${postID}`);
        }

        // delete Post
        const deletedPost = await Post.findByIdAndDelete(postID);

        // delete all post Duties
        await Duty.deleteMany({ post: postID });

        // delete Post ID from Unit.posts
        unit.posts = unit.posts.filter(id => !id.equals(mongoose.Types.ObjectId(postID)));
        await unit.save();

        return deletedPost;
      } catch (error) {
        return error;
      }
    },
    // Unit
    createUnit: async (_, { parentUnitId, unit }, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }

      try {
        const parentUnit = await Unit.findById(parentUnitId);

        if (!parentUnit) {
          return new Error(`Unit ${parentUnitId} couldn't be found`);
        }

        const createdUnit = await Unit.create({ ...unit, parentUnit: parentUnitId });

        // add Unit ID to parent Unit.childUnits
        parentUnit.childUnits = parentUnit.childUnits.concat([createdUnit._id]);
        await parentUnit.save();

        return createdUnit;
      } catch (error) {
        return error;
      }
    },
    deleteUnit: async (_, { id }, req) => {
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
          return new Error(`Unit ${id} doesn't have parent Unit`);
        }

        parentUnit.childUnits = parentUnit.childUnits.filter(childUnitId => !childUnitId.equals(mongoose.Types.ObjectId(id)));
        await parentUnit.save();

        // delete Unit
        await unitToDelete.deleteOne();

        return unitToDelete;
      } catch (error) {
        return error;
      }
    },
    // Employee
    createEmployee: async (_, { unitID, employeeData }, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }
      try {
        // find Unit
        const unit = await Unit.findById(unitID);
        if (!unit) {
          return new Error(`Unit ${unitID} for employee was not found`);
        }
        // create Employee
        const employee = await Employee.create(employeeData);
        // add Employee ID to Unit.employees
        unit.employees = unit.employees.concat([employee._id]);
        await unit.save();

        return employee;
      } catch (error) {
        return error;
      }
    },
    updateEmployee: async (_, { employeeID, employeeData }, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }
      try {
        return await Employee.findByIdAndUpdate(employeeID, employeeData, { new: true });
      } catch (error) {
        return error;
      }
    },
    deleteEmployee: async (_, { unitID, employeeID }, req) => {
      try {
        // find unit for Employee
        const unit = await Unit.findById(unitID);
        if (!unit) {
          return new Error(`Impossible to find a Unit ${unitID} for the Employee ${employeeID}`);
        }
        // delete Employee ID from Unit.employees
        unit.employees = unit.employees.filter(id => !id.equals(mongoose.Types.ObjectId(employeeID)));
        await unit.save();
        // delete Employee
        return await Employee.findByIdAndDelete(employeeID);
      } catch (error) {
        return error;
      }
    },
    // Position
    createPosition: async (_, { positionData }, req) => {
      if (!req.isAuth) {
        return new Error('Unauthorized');
      }
      try {
        // find senior Position
        const seniorPosition = await Position.findById(positionData.seniorPosition);
        if (!seniorPosition) {
          return new Error(`Senior position ${positionData.seniorPosition} for Position '${positionData.name}' not found`);
        }
        // create Position
        const position = await Position.create(positionData);
        seniorPosition.juniorPositions = seniorPosition.juniorPositions.concat([position._id]);
        await seniorPosition.save();

        return position;
      } catch (error) {
        return error;
      }
    },
    updatePosition: async (_, { id, positionData }, req) => {
      if (!req.isAuth) {
        return new Error('Unauthorized');
      }
      try {
        return await Position.findByIdAndUpdate(id, positionData, { new: true });
      } catch (error) {
        return error;
      }
    },
    deletePosition: async (_, { id }, req) => {
      if (!req.isAuth) {
        return new Error('Unauthorized');
      }
      try {
        // find Position
        const position = await Position.findById(id);
        if (!position) {
          return new Error(`Can't find Position '${id}'`);
        }
        // find senior Position
        const seniorPosition = await Position.findById(position.seniorPosition);
        if (!seniorPosition) {
          return new Error(`Can't find senior position for Position '${id}'`);
        }
        await position.deleteOne();
        // remove Position ID from seniorPosition.juniorPositions
        seniorPosition.juniorPositions = seniorPosition.juniorPositions.filter(juniorPositionID => !juniorPositionID.equals(mongoose.Types.ObjectId(id)));
        await seniorPosition.save();

        return position;
      } catch (error) {
        return error;
      }
    },
  }
};