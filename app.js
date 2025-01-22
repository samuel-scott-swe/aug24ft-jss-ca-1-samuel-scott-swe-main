var createError = require('http-errors');
var express = require('express');
var path = require('path');
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
const pathToDataFile = path.join(__dirname, 'data', 'memes.json');
const apiConfiguration = JSON.parse(fs.readFileSync('./api.json', 'utf-8')); // Load API URL from config
const apiUrl = apiConfiguration.apiUrl;
console.log('API URL loaded:', apiUrl);

// Fetch memes from the API and cache them in the data file
async function fetchAndCacheMemes(apiUrl) {
  try {
    const http = require('http');
    let data = '';

    const response = await new Promise((resolve, reject) => {
      http.get(apiUrl, (res) => {
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => resolve(data));
        res.on('error', (err) => reject(err));
      });
    });

    const parsedData = JSON.parse(response);
    const memes = parsedData.memes || parsedData;

    // Cache memes in data file
    const cacheData = { memes, viewedMemes: [] };
    fs.writeFileSync(pathToDataFile, JSON.stringify(cacheData, null, 2), 'utf-8');

    console.log('Memes fetched and cached in data/memes.json.');
    return memes;
  } catch (error) {
    console.error('Error fetching or caching memes:', error.message);
    throw error;
  }
}

// Initialize memes cache during server startup
(async () => {
  try {
    if (!fs.existsSync(pathToDataFile)) {
      fs.writeFileSync(pathToDataFile, JSON.stringify({ memes: [], viewedMemes: [] }, null, 2), 'utf-8');
    }
    const memes = await fetchAndCacheMemes(apiUrl);
    app.set('memeCache', memes); // Store in app-level cache
  } catch (error) {
    console.error('Failed to initialize meme cache:', error);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
