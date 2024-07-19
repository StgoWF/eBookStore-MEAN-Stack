const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Add a new book
router.post('/', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).send('Book added');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;