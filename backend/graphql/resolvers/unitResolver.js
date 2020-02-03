const Employee = require('../../models/Employee');
const Unit = require('../../models/Unit');
const Post = require('../../models/Post');
const Duty = require('../../models/Duty');

module.exports = {
  Unit: {
    head: async (parent) => {
      try {
        return await Employee.findById(parent.head);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    employees: async (parent) => {
      try {
        return await Employee.find({ _id: { $in: parent.employees } });
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    childUnits: async (parent) => {
      try {
        return await Unit.find({ _id: { $in: parent.childUnits } });
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    posts: async (parent, { id }) => {
      try {
        const posts = await Post.find({ _id: { $in: id ? [id] : parent.posts } });
        const duties = await Duty.find({ post: { $in: posts.map(({ _id }) => _id) } }, '_id post');

        return posts.map(post => {
          return Object.assign({},
            post._doc, {
              duties: duties.filter(duty => duty.post.equals(post._id)).map(duty => duty._id)
            })
        });
      } catch (error) {
        return error;
      }
    }
  }
};

