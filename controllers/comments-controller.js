const { patchComment } = require('../models/comments-model');

exports.updateComment = (req, res) => {
  patchComment(req.params, req.body).then(([updatedComment]) => {
    res.status(200).json({ updatedComment });
  });
};
