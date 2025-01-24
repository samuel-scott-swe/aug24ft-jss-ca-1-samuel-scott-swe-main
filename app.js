var express = require('express');
var createError = require('http-errors');
var path = require('path');
var logger = require('morgan');
const fs = require('fs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/authentication'); // For Login/Logout
const memesRouter = require('./routes/memes'); // For Meme Overview
const memeRouter = require('./routes/meme'); // For Meme Details

var app = express();

// Load API configuration
const pathToDataFile = path.join(__dirname, 'data', 'memes.json');
const apiConfiguration = JSON.parse(fs.readFileSync('./api.json', 'utf-8')); // Load API URL from config
const apiUrl = apiConfiguration.apiUrl;

// Configure express-session
app.use(
  session({
    secret: 'supersecretkey', // Replace with a more secure secret in production
    resave: false,
    saveUninitialized: false,
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

// Initialize PassportJS
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // Initialize flash messages

// Path to users.json file
const pathToUsersFile = path.join(__dirname, 'data', 'users.json');

// Load users from users.json
const users = JSON.parse(fs.readFileSync(pathToUsersFile, 'utf-8'));

// Configure PassportJS LocalStrategy
passport.use(
  new LocalStrategy((username, password, done) => {
    const user = users.find((u) => u.username === username);
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  })
);

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user.username);
});

// Deserialize user from session
passport.deserializeUser((username, done) => {
  const user = users.find((u) => u.username === username);
  if (!user) {
    return done(new Error('User not found'));
  }
  done(null, user);
});

// Authentication middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

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

    return memes;
  } catch (error) {
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
    throw error;
  }
})();

// Register routers
app.use('/login', authRouter); // Login and Logout handling
app.use('/memes', memesRouter); // Handle Meme Overview and search
app.use('/memes/meme', memeRouter); // Handle Meme Details
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
