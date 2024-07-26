require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('./firebase-admin');
const jwt = require('jsonwebtoken');
const path = require('path');  // Added for serving static files

const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');  // Make sure this is the correct path

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Static file serving for Angular app
app.use(express.static(path.join(__dirname, 'ebookstore-client/dist/ebookstore-client')));

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  await seedBooks();  // Ensure this is correctly defined to insert test data
});

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

app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', verifyToken, cartRoutes);
app.use('/api/payment', paymentRoutes);  // Ensure the correct import and path

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Serve Angular app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'ebookstore-client/dist/ebookstore-client/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
