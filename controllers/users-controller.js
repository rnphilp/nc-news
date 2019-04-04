const { getUser } = require('../models/users-model');

exports.fetchUser = (req, res) => {
  getUser(req.params).then(([user]) => {
    res.status(200).json({ user });
  });
};
