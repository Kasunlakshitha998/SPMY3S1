const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const cookieParser = require('cookie-parser');

router.use(cookieParser());
const dotenv = require('dotenv');
dotenv.config();  

// Register Route
router.post('/register', async (req, res) => {
  const { name, email, age, password, confirmPassword } = req.body;

  // Validate fields
  if (!name || !email || !password || !confirmPassword || !age) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ msg: 'Passwords do not match' });
  }

  try {
    // Check if the user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password and create user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      age,
      password: hashedPassword,
    });

    await user.save();

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login Route
router.route('/login').post((req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            res.json({ status: 'error', error: err.message });
          } else {
            if (result) {
              const token = jwt.sign({ email: user.email }, 'jwt-secret-key', {
                expiresIn: '1d',
              });
              // Set the token as a cookie
              res.cookie('token', token, { httpOnly: true, maxAge: 86400000 }); // Max age set to 1 day in milliseconds
              res.cookie('userEmail', user.email, { maxAge: 86400000 });

              // Send user ID along with other data
              res.json({
                status: 'success',
                userId: user._id,
                age : user.age,
              });
            } else {
              res.status(401).json({ status: 'incorrect password' });
            }
          }
        });
      } else {
        res.status(404).json({ status: 'no record existed' });
      }
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', error: err.message });
    });
});


module.exports = router;
