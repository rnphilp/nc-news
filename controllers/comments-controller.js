const { patchComment } = require('../models/comments-model');

exports.updateComment = (req, res, next) => {
  patchComment(req.params, req.body)
    .then(([updatedComment]) => {
      if (!updatedComment) {
        return Promise.reject({
          status: 404,
          msg: `comment_id '${req.params.comment_id}' Not Found`,
        });
      } res.status(200).json({ updatedComment });
    })
    .catch(next);
};
