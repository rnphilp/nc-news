exports.handle400 = (err, req, res, next) => {
  if (err.status === 400 || err.code === '22P02') {
    res.status(400).send({ msg: 'Bad Request' });
  } else next(err);
};

exports.handle404 = (err, req, res, next) => {
  if (!err.msg) res.status(404).send({ msg: 'Route Not Found' });
  else res.status(404).send({ msg: err.msg });
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};
