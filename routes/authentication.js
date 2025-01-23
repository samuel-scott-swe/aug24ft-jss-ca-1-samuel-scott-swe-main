const express = require('express');
const passport = require('passport');
const router = express.Router();

// Render login page
router.get('/', (req, res) => {
  res.render('login', { message: req.flash('error') }); // connect-flash
});

// Handle login POST
router.post('/', passport.authenticate('local', {
  successRedirect: '/memes',
  failureRedirect: '/login',
  failureFlash: true,
}));

// Handle logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;
