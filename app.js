const express = require('express');
const apiRouter = require('./routes/api');
const { handle400, handle404, handle500 } = require('./errors');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', handle404);

app.use(handle400);
app.use(handle404);
app.use(handle500);

module.exports = app;
