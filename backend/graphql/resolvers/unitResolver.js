const Employee = require('../../models/Employee');
const Unit = require('../../models/Unit');
const Post = require('../../models/Post');

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
        return await Employee.find({_id: {$in: parent.employees}});
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    childUnits: async (parent) => {
      try {
        return await Unit.find({_id: {$in: parent.childUnits}});
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    posts: async (parent, {id}) => {
      try {
        const posts = await Post.find({_id: {$in: parent.posts}});
        return id
          ? posts.filter(post => post.id === id)
          : posts;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  }
};

