const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const swaggerUI = require('swagger-ui-express');
const swaggerYaml = require('yamljs');
const logger = require('morgan');
const { promise } = require('./init/db');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const dirname = path.resolve();

const app = express();
const swaggerDoc = swaggerYaml.load('./swagger.yaml');

// eslint-disable-next-line no-console
promise.then(() => console.log("Connection successful!"));

// view engine setup
app.set('views', path.join(dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(dirname, 'public')));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
