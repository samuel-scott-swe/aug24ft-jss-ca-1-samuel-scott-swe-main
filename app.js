// Dependencies and libraries.
// --------------------------------------------------------------
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var app = express();


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // This will be used for login feature later
console.log('All packages loaded successfully, Thank goddness');
// ---------------------------------------------------------------
// Fetch and Cache 20 memes from API.json
const fs = require('fs');

const apiConfiguration = JSON.parse(fs.readFileSync('./api.json'));

const apiUrl = apiConfiguration.apiUrl;
console.log('API URL loaded:', apiUrl);

const http = require('http');
let memeCache = []; // Cache to store the 20 memes

// Fetch memes from the API
http.get(apiUrl, (res) => {
  let data = '';

  // Collect data in chunks
  res.on('data', (chunk) => {
    data += chunk;
  });

  // Parse and store memes when the response is complete
  res.on('end', () => {
    memeCache = JSON.parse(data);
    console.log('Memes fetched and cached:', memeCache);
  });
}).on('error', (err) => {
  console.error('Error fetching memes:', err);
});
// -----------------------------------------
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;

