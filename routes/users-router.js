const usersRouter = require('express').Router();
const { fetchUser } = require('../controllers/users-controller');

usersRouter.route('/:username').get(fetchUser);

module.exports = usersRouter;
