const { patchComment, deleteComment } = require('../models/comments-model');

exports.updateComment = (req, res, next) => {
  patchComment(req.params, req.body)
    .then(([comment]) => {
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: `comment_id '${req.params.comment_id}' Not Found`,
        });
      }
      res.status(200).json({ comment });
    })
    .catch(next);
};

exports.removeComment = (req, res, next) => {
  deleteComment(req.params)
    .then((removedComment) => {
      if (removedComment.length < 1) {
        return Promise.reject({
          status: 404,
          msg: `comment_id '${req.params.comment_id}' Not Found`,
        });
      }
      res.status(204).send();
    })
    .catch(next);
};
