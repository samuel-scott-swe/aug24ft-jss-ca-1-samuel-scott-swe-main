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

    res.render('memes', {
      memes: memeCache,
      viewedMemes,
      noResults: false, // Default noResults to false for initial load
      memeImagePath: '', // No image path needed for initial load
      user: req.user // Pass the user object to the view
    });
  } catch (error) {
    console.error('Error reading or parsing memes.json:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/search', (req, res) => {
  try {
    const searchTerm = req.body.searchTerm?.toLowerCase() || '';
    console.log('Search Term:', searchTerm); // Debugging

    const data = JSON.parse(fs.readFileSync(pathToDataFile, 'utf-8'));
    console.log('Memes Data:', data.memes); // Debugging

    const filteredMemes = data.memes.filter(meme =>
      meme.name.toLowerCase().includes(searchTerm)
    );
    console.log('Filtered Memes:', filteredMemes); // Debugging

    const noResults = filteredMemes.length === 0; // Determine if there are no results
    console.log('No Results:', noResults); // Debugging

    res.render('memes', {
      memes: filteredMemes,
      viewedMemes: data.viewedMemes,
      noResults, // Pass the noResults flag
      memeImagePath: noResults ? '/images/no-results-meme.jpg' : '',
      user: req.user // Pass the user object to the view
    });
  } catch (error) {
    console.error('Error handling /search route:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
