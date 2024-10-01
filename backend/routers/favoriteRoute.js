const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite');

// Add to favorites
router.post('/add', (req, res) => {
  const { user, text, translatedText, createdAt } = req.body;

  const newFavorite = new Favorite({
    user,
    text,
    translatedText,
    createdAt,
  });

  newFavorite
    .save()
    .then(() => res.json('Favorite Added'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

// Get all favorites
router.get('/', (req, res) => {
  Favorite.find()
    .sort({ createdAt: -1 }) // Sort by 'createdAt' descending
    .then((favorites) => {
      res.json(favorites);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json('Error: ' + err);
    });
});


// Update a favorite
router.put('/update/:id', async (req, res) => {
  try {
    const favoriteId = req.params.id;
    const { text, translatedText } = req.body;

    const updateFavorite = {
      text,
      translatedText,
    };

    const updatedFavorite = await Favorite.findByIdAndUpdate(
      favoriteId,
      updateFavorite,
      { new: true }
    );

    if (!updatedFavorite) {
      return res.status(404).json({ status: 'Favorite Not Found' });
    }

    res
      .status(200)
      .json({ status: 'Favorite Updated', favorite: updatedFavorite });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 'Error with updating data', error: error.message });
  }
});

// Delete a favorite
router.delete('/delete/:id', async (req, res) => {
  const favoriteId = req.params.id;

  try {
    const deletedFavorite = await Favorite.findByIdAndDelete(favoriteId);

    if (!deletedFavorite) {
      return res.status(404).json({ status: 'Favorite Not Found' });
    }

    res.status(200).json({ status: 'Favorite Deleted' });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ status: 'Error with delete favorite', error: err.message });
  }
});

// Get a specific favorite by ID
router.get('/get/:id', async (req, res) => {
  const favoriteId = req.params.id;

  try {
    const favorite = await Favorite.findById(favoriteId);

    if (!favorite) {
      return res.status(404).json({ status: 'Favorite Not Found' });
    }

    res.status(200).json({ status: 'Favorite Fetched', favorite });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ status: 'Error with get favorite', error: err.message });
  }
});

module.exports = router;
