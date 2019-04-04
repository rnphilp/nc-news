const commentsRouter = require('express').Router();
const { updateComment } = require('../controllers/comments-controller');

commentsRouter.route('/:comment_id').patch(updateComment);

module.exports = commentsRouter;
