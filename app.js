const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { default: axios } = require('axios');
const mongoose = require('mongoose');
const { profiler } = require('@ghadautopia/express-profiler');
const { axiosScope, axiosStreamMiddleware } = require('@ghadautopia/express-profiler-axios');
const { mongooseScope, mongooseStreamMiddleware } = require('@ghadautopia/express-profiler-mongoose');

const { router: indexRouter, axios2 } = require('./routes/index');

const app = express();

app.locals.testScopes = [
  { 
    name: 'axios', 
    options: [
      { value: 'GET', checked: false },
      { value: 'POST', checked: false },
      { value: 'DELETE', checked: false },
      { value: 'error_conn', checked: false, isError: true },
      { value: 'error_unhandled', checked: false, isError: true, description: 'The response error coming from axios was NOT caught' },
      { value: 'error_handled', checked: false, isError: true, description: 'The response error coming from axios was caught' },
    ] 
  },
  { 
    name: 'mongoose', 
    options: [
      { value: 'fetch', checked: false },
      { value: 'error_unhandled', checked: false, isError: true, description: 'The error raised by mongoose was NOT caught' },
      { value: 'error_handled', checked: false, isError: true, description: `The error raised by mongoose was caught.` },
    ]
  },
];

app.locals.testErrors = [
  { name: "handled error", description: "This error is handled by express next() function", color: "warning", href: "error-handled" },
  { name: "unhandled error", description: "This error should break the app as it is not handeled by express next() function", color: "danger", href: "error-unhandled" }
];


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

logger.token('profiler-token', function getToken (req, res) {
  return res.getHeader('X-Profiler-Token');
})

const morgan = logger(':profiler-token [:date[iso]] :remote-addr :remote-user :method HTTP/:http-version :url :status res-headers/:response-time ms - :res[content-length] ":referrer" ":user-agent"');

app.use(morgan);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
profiler(app, {
  scopes: [
    axiosScope,
    mongooseScope,
  ],
  streamMiddlewares: [
    axiosStreamMiddleware(axios),
    axiosStreamMiddleware(axios2),
    mongooseStreamMiddleware(mongoose)
  ],
});
profiler(app);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
