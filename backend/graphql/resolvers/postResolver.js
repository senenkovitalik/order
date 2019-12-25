const mongoose = require('mongoose');
const Post = require('../../models/Post');

module.exports = {
  postMutation: {
    createPost: async ({unitId, postName}, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }

      try {
        const post = new Post({
          name: postName,
          unit: unitId
        });
        return await post.save();
      } catch (err) {
        console.log(err);
      }
    },
    deletePost: async ({id}, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }

      try {
        const post = await Post.findById(id).exec();
        return await post.remove();
      } catch (err) {
        throw err;
      }
    }
  }
};
