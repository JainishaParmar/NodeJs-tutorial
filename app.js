import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mangoose from 'mongoose';

import swaggerUI from 'swagger-ui-express';
import swaggerYaml from 'yamljs';

import indexRouter from './routes/index';
import usersRouter from './routes/users';

const dirname = path.resolve();

mangoose
  .connect("mongodb://localhost:27017/tutorials", {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connection successfull!"))
  .catch((err) => console.log);

// Schema
const tutorialSchema = new mangoose.Schema({
  id: {
    type: String,
    required: true,
  },
  published: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// collection creation (model)
const Tutorial = new mangoose.model("Tutorial", tutorialSchema);

// create Document or insert
const createDocument = async () => {
  try {
    const demoTutorial = new Tutorial({
      id: "1",
      published: true,
    });

    const result = await demoTutorial.save();
    console.log(result);
  } catch (err) {
    console.log(err);
  }
};

createDocument();

const app = express();
const swaggerDoc = swaggerYaml.load('./swagger.yaml');

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

export default app;
