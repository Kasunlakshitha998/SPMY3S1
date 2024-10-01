const express = require('express');
const router = express.Router();
const Favorite = require('../models/imageSave');

// Add new favorite
router.post('/add', (req, res) => {
  const { user, image, originalText, translatedText, createdAt } = req.body;

  const newSave = new Favorite({
    user,
    image, // Save Base64 image data
    originalText,
    translatedText,
    createdAt,
  });

  newSave
    .save()
    .then(() => res.json('Image Added'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

// Get saved items
router.get('/', (req, res) => {
  Favorite.find()
    .then((imageSave) => {
      res.json(imageSave);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json('Error: ' + err);
    });
});

// Delete a saved item
router.delete('/delete/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    const deletedItem = await Favorite.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ status: 'Item Not Found' });
    }

    res.status(200).json({ status: 'Item Deleted' });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ status: 'Error with deleting item', error: err.message });
  }
});

// Update a saved item
router.put('/update/:id', async (req, res) => {
  const itemId = req.params.id;
  const { image, originalText, translatedText } = req.body; // Updated fields

  try {
    // Find the item by ID and update the fields
    const updatedItem = await Favorite.findByIdAndUpdate(
      itemId,
      { image, originalText, translatedText },
      { new: true } // Returns the updated document
    );

    if (!updatedItem) {
      return res.status(404).json({ status: 'Item Not Found' });
    }

    res.status(200).json({ status: 'Item Updated', updatedItem });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ status: 'Error with updating item', error: err.message });
  }
});

module.exports = router;
