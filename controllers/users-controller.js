const { getUser } = require('../models/users-model');

exports.fetchUser = (req, res, next) => {
  getUser(req.params)
    .then(([user]) => {
      if (!user) {
        return Promise.reject({ status: 404, msg: `username '${req.params.username}' Not Found` });
      }
      res.status(200).json({ user });
    })
    .catch(next);
};
