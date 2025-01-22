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

  // Retrieve and parse the `viewedMemes` cookie
  let viewedMemes = req.cookies.viewedMemes ? JSON.parse(decodeURIComponent(req.cookies.viewedMemes)) : [];
  if (!Array.isArray(viewedMemes)) {
    console.error('viewedMemes is not an array:', viewedMemes);
    viewedMemes = []; // Ensure it is an array
  }

  console.log('Retrieved viewedMemes from cookies:', viewedMemes);

  // Render the memes.ejs template with the correct structure
  res.render('memes', { memes: memeCache.memes || memeCache, viewedMemes });
});

// Route for Meme Details
router.get('/meme/:id', function (req, res, next) {
  const memeCache = req.app.get('memeCache'); // Access cached memes
  const memeId = parseInt(req.params.id, 10); // Parse ID from the URL
  const selectedMeme = memeCache.find((meme) => meme.id === memeId); // Find the meme by ID

  if (!selectedMeme) {
    return res.status(404).send('Meme not found');
  }

  // Retrieve and parse the `viewedMemes` cookie
  let viewedMemes = req.cookies.viewedMemes ? JSON.parse(decodeURIComponent(req.cookies.viewedMemes)) : [];
  if (!Array.isArray(viewedMemes)) {
    console.error('viewedMemes is not an array:', viewedMemes);
    viewedMemes = []; // Ensure it is an array
  }

  console.log('Before setting cookie, viewedMemes:', viewedMemes);

  // Add the meme ID to the `viewedMemes` array
  if (!viewedMemes.includes(memeId)) {
    viewedMemes.push(memeId); // Add the current meme ID to the array
    res.cookie('viewedMemes', JSON.stringify(viewedMemes), { path: '/' }); // Update the cookie
    console.log('Updated viewedMemes in cookie:', viewedMemes);
  }

  res.render('meme', { meme: selectedMeme }); // Render the Meme Details page
});

module.exports = router;
