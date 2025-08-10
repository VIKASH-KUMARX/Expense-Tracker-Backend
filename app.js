var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')


var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var cashInRouter = require('./routes/cashIn');
var sourceRouter = require('./routes/source');
var cashOutRouter = require('./routes/cashOut');
var categoryRouter = require('./routes/category');

var app = express();

mongoose.connect(process.env.MONGODB_URL)
  .then(res=>console.log("MongoDB connected Successfully : ",res))
  .catch(err=>console.error("Failed to connect MongoDB :",err))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/cash-in', cashInRouter);
app.use('/source', sourceRouter);
app.use('/cash-out', cashOutRouter);
app.use('/category', categoryRouter);


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
