// meme.js is responsible for any logic pertaining to the mean details page.


const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const pathToDataFile = path.join(__dirname, '../data/memes.json');

// GET
router.get('/:id', (req, res) => {
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
    }

    res.render('meme', { meme: selectedMeme });
  } catch (error) {
    console.error('Error handling /meme/:id route:', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST
router.post('/', (req, res) => {
  try {
    const memeId = parseInt(req.body.id, 10);
    const data = JSON.parse(fs.readFileSync(pathToDataFile, 'utf-8'));
    const meme = data.memes.find((m) => m.id === memeId);

    if (!meme) {
      return res.status(404).send('Meme not found');
    }

    res.redirect(`/memes/meme/${memeId}`);
  } catch (error) {
    console.error('Error handling POST /memes/meme:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
