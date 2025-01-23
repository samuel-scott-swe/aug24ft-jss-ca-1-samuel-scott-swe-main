// memes.js is responsible for any logic pertaining to the meme overview page.

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const pathToDataFile = path.join(__dirname, '../data/memes.json');

// Route for Meme Overview Page
router.get('/', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(pathToDataFile, 'utf-8'));
    const memeCache = data.memes;
    const viewedMemes = data.viewedMemes;

    if (!Array.isArray(memeCache) || memeCache.length === 0) {
      return res.status(500).send('No memes available. Check the API or server logic.');
    }

    res.render('memes', { memes: memeCache, viewedMemes });
  } catch (error) {
    console.error('Error reading or parsing memes.json:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for search functionality
router.post('/search', (req, res) => {
  try {
    const searchTerm = req.body.searchTerm?.toLowerCase() || '';
    const data = JSON.parse(fs.readFileSync(pathToDataFile));
    const memeCache = data.memes;

    // Filter memes based on the search term
    const filteredMemes = searchTerm
      ? memeCache.filter((meme) => meme.name.toLowerCase().includes(searchTerm))
      : memeCache;

    // Render the memes.ejs with filtered results
    res.render('memes', { memes: filteredMemes, viewedMemes: data.viewedMemes });
  } catch (error) {
    console.error('Error handling POST /search:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
