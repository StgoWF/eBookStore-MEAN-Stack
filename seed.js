// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/bookModel');

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  // Datos de prueba
  const books = [
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Fiction',
      price: 10.99,
      description: 'A novel set in the Jazz Age on Long Island, near New York City.',
    },
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Fiction',
      price: 8.99,
      description: 'A novel about the serious issues of rape and racial inequality.',
    },
    {
      title: '1984',
      author: 'George Orwell',
      genre: 'Dystopian',
      price: 9.99,
      description: 'A novel that tells the story of a dystopian society under totalitarian rule.',
    },
  ];

  try {
    await Book.insertMany(books);
    console.log('Seed data inserted successfully');
  } catch (err) {
    console.error('Error inserting seed data:', err);
  } finally {
    mongoose.connection.close();
  }
});
