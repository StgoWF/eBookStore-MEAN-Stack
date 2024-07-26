const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const admin = require('./firebase-admin');
const seedBooks = require('./seed');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/payment');

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:4200', // For local development
  'https://ebookemporium-5f402b9d9f4b.herokuapp.com' // For production
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow requests with no origin (like mobile apps or curl requests)
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Serve static files from Angular app
app.use(express.static(path.join(__dirname, '../client/ebookstore-client/dist/ebookstore-client')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  await seedBooks(); // Ensure this function is correctly defined to insert test data
});

// Middleware to verify tokens
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send('Unauthorized');
  }

  const token = authHeader.split('Bearer ')[1];

  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const decodedFirebaseToken = await admin.auth().verifyIdToken(token);
    console.log('Firebase token verified:', decodedFirebaseToken);
    req.user = { id: decodedFirebaseToken.uid };
    return next();
  } catch (error) {
    console.log('Firebase token verification failed:', error.message);
  }

  try {
    const decodedJwtToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log('JWT token verified:', decodedJwtToken);
    req.user = decodedJwtToken;
    return next();
  } catch (error) {
    console.log('JWT token verification failed:', error.message);
    return res.status(401).send('Unauthorized');
  }
};

// Define routes
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', verifyToken, cartRoutes);
app.use('/api/payment', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Serve Angular app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/ebookstore-client/dist/ebookstore-client/index.html'));
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
