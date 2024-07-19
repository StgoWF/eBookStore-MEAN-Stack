// server/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new book
router.post('/', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    price: req.body.price,
    description: req.body.description
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Middleware to get book by ID
async function getBook(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);
    if (book == null) {
      return res.status(404).json({ message: 'Cannot find book' });
    }
    res.book = book;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
