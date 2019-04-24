const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api-router');
const { handle400, handle404, handle500 } = require('./errors');

const app = express();
app.use(cors());

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', (req, res, next) => next({ status: 404 }));

app.use(handle400);
app.use(handle404);
app.use(handle500);

module.exports = app;
