exports.handle400 = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ msg: 'Bad Request' });
  } else {
    next(err);
  }
};

exports.routeNotFound = (err, req, res, next) => {
  res.status(404).send({ msg: 'Route Not Found' });
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};
