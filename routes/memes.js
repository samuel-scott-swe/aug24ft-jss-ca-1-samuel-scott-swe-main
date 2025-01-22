var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

const pathToDataFile = path.join(__dirname, '../data/memes.json');

// Route for Meme Overview
router.get('/', function (req, res, next) {
  try {
    const data = JSON.parse(fs.readFileSync(pathToDataFile));
    const memeCache = data.memes;
    const viewedMemes = data.viewedMemes;

    if (!Array.isArray(memeCache) || memeCache.length === 0) {
      return res.status(500).send('No memes available. Check the API or server logic.');
    }

    console.log('Meme Cache in /memes route:', memeCache);
    console.log('Viewed Memes in /memes route:', viewedMemes);

    res.render('memes', { memes: memeCache, viewedMemes });
  } catch (error) {
    console.error('Error reading or parsing memes.json:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for Meme Details
router.get('/meme/:id', function (req, res, next) {
  try {
    const data = JSON.parse(fs.readFileSync(pathToDataFile, 'utf-8'));
    const memeCache = data.memes;
    const viewedMemes = data.viewedMemes;
    const memeId = parseInt(req.params.id, 10);

    const selectedMeme = memeCache.find((meme) => meme.id === memeId);

    if (!selectedMeme) {
      return res.status(404).send('Meme not found');
    }

    // Add the meme ID to the viewedMemes array if not already present
    if (!viewedMemes.includes(memeId)) {
      viewedMemes.push(memeId);
      fs.writeFileSync(pathToDataFile, JSON.stringify({ memes: memeCache, viewedMemes }, null, 2), 'utf-8');
      console.log('Updated viewedMemes in memes.json:', viewedMemes);
    }

    res.render('meme', { meme: selectedMeme });
  } catch (error) {
    console.error('Error handling /meme/:id route:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
