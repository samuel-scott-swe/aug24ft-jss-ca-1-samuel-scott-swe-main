var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var memesRouter = require('./routes/memes'); // Import memes router
var app = express();

// Dependencies and libraries.
// --------------------------------------------------------------
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
console.log('All packages loaded successfully');
// ---------------------------------------------------------------

// Load API configuration
const fs = require('fs');
const apiConfiguration = JSON.parse(fs.readFileSync('./api.json', 'utf-8')); // Load API URL from config
const apiUrl = apiConfiguration.apiUrl;
console.log('API URL loaded:', apiUrl);

// Fetch memes from the API and cache them
function fetchMemes(apiUrl) {
  return new Promise((resolve, reject) => {
    const http = require('http');
    let data = '';

    http.get(apiUrl, (res) => {
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData.memes || parsedData); // Use `memes` property or the entire object
        } catch (error) {
          reject('Error parsing memes: ' + error.message);
        }
      });
    }).on('error', (err) => {
      reject('Error fetching memes: ' + err.message);
    });
  });
}

// Use async to ensure memes are fetched before starting the app
(async () => {
  try {
    const memes = await fetchMemes(apiUrl); // Pass apiUrl to fetchMemes
    app.set('memeCache', memes); // Store memes in app-level cache
    console.log('Memes fetched and cached:', memes);

    // Start the server only after memes are fetched
    const http = require('http');
    const server = http.createServer(app);
    server.listen(3000, () => console.log('Server running on http://localhost:3000/'));
  } catch (error) {
    console.error('Failed to fetch memes:', error);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

// Register routers
app.use('/memes', memesRouter); // Register memes router
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
