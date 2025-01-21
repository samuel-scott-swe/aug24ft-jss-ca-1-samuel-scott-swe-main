
var express = require('express');
var router = express.Router();

// Route for Meme Overview
router.get('/', function (req, res, next) {
  const memeCache = req.app.get('memeCache'); // Retrieve the cached memes
  console.log('Meme Cache in /memes route:', memeCache);

  // Validate that memeCache is an array with content
  if (!Array.isArray(memeCache) || memeCache.length === 0) {
    return res.status(500).send('No memes available. Check the API or server logic.');
  }

  // Render the memes.ejs template with the correct structure
  res.render('memes', { memes: memeCache.memes || memeCache });
});

module.exports = router;
