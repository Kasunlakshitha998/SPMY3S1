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
    .then(() => res.json('image Added'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

// Get save
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
    const deletedItem = await Favorite.findByIdAndDelete(itemId); // Assuming the model is 'Favorite'

    if (!deletedItem) {
      return res.status(404).json({ status: 'Item Not Found' }); // Changed message
    }

    res.status(200).json({ status: 'Item Deleted' }); // Changed message
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'Error with deleting item', error: err.message }); // Changed message
  }
});



module.exports = router;
