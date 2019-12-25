const Unit = require('../../models/Unit');

module.exports = {
  unitQuery: {
    unit: async ({ id }, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }
      try {
        const populateOpts = [
          {
            path: 'head',
            model: 'Employee',
            populate: [
              {
                path: 'rank',
                model: 'Rank'
              }, {
                path: 'position',
                model: 'Position',
                populate: {
                  path: 'juniorPositions',
                  model: 'Position'
                }
              }]
          },
          {
            path: 'employees',
            model: 'Employee',
            populate: [
              {
                path: 'rank',
                model: 'Rank'
              },
              {
                path: 'position',
                model: 'Position'
              }
            ]
          },
          {
            path: 'posts',
            model: 'Post'
          },
          {
            path: 'childUnits',
            model: 'Unit'
          }
        ];
        return await Unit.findById(id).populate(populateOpts).exec();
      } catch (err) {
        throw err;
      }
    },
    units: async (args, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }
      try {
        return await Unit.find().exec();
      } catch (err) {
        throw err;
      }
    },
  },
  unitMutation: {
    createUnit: async (args, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthorized');
      }
      try {
        const unitModel = new Unit(args);
        const newUnit = await unitModel.save();
        return await Unit.findById(newUnit._id);
      } catch (err) {
        throw err;
      }
    }
  }
};

