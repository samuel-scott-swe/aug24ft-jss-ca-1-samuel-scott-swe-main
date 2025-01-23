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

module.exports = router;
