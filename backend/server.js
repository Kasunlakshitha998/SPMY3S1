const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const app = express();

// Load environment variables from .env
dotenv.config();

app.use(bodyParser.json({ limit: '10mb' })); // Increase limit as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));


// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// MongoDB connection
const URL = process.env.MONGO_URI;

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process if connection fails
  });




const favoriteRoutes = require('./routers/favoriteRoute');
app.use('/favorites', favoriteRoutes);

const historyRoutes = require('./routers/historyRoute');
app.use('/history', historyRoutes);

const imageRoutes = require('./routers/imageRouter');
app.use('/imageSave', imageRoutes);

const ivoiceHistoryRoutes = require('./routers/voiceHistoryRoute');
app.use('/voiceHistory', ivoiceHistoryRoutes);


// Add a base route to confirm server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).send('Something went wrong!');
});

// Set Content-Type for all responses to ensure UTF-8 encoding
app.use((req, res, next) => {
  res.set('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Example route for fetching history
app.get('/api/history', async (req, res) => {
  try {
    // Fetch your history data from the database here
    const historyData = await getHistoryFromDatabase();

    // Set the Content-Type header for UTF-8 encoding
    res.set('Content-Type', 'application/json; charset=utf-8');

    // Send the response
    res.json(historyData);
  } catch (error) {
    console.error('Failed to fetch history:', error);
    res.status(500).json({ message: 'Error fetching history' });
  }
});

// Start server
const PORT = process.env.PORT || 8175;
app.listen(PORT, () => {
  console.log(`Server is up and running on port: ${PORT}`);
});




