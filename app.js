var createError   = require('http-errors');
var express       = require('express');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var logger        = require('morgan');
var multer        = require('multer');
var upload        = multer();
var oracledb      = require('oracledb');
var cors          = require('cors');

const bodyParser  = require('body-parser');
const uuid        = require('uuid/v4');
const session     = require('express-session');

var app           = express();

app.use(cors());

// Import file Routing and Controllers
var indexController   = require('./controllers/index.controller');
var userController    = require('./controllers/user.controller');
var courseController  = require('./controllers/course.controller');
// Tugas
var assessmentController  = require('./controllers/dosen/assessment.controller');
// Dosen
var subjectController  = require('./controllers/dosen/subject.controller.js');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// for parsing multipart/form-data
app.use(upload.array()); 


// Routing and Controllers 
app.use('/', indexController);
app.use('/user', userController);
app.use('/course', courseController);
app.use('/assessment', assessmentController);
// Dosen
app.use('/lecturer/subject', subjectController);


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


module.exports = oracledb;
module.exports = app;
