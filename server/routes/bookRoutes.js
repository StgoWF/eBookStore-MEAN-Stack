const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const getBookImage = require('../services/bookImageService');
const getBookDetails = require('../services/bookDetailService');

// Obtener todos los libros
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Agregar un nuevo libro
router.post('/', async (req, res) => {
  try {
    const details = await getBookDetails(req.body.title);
    const imageUrl = await getBookImage(req.body.title);

    const book = new Book({
      title: details.title || req.body.title,
      author: details.authors.join(', ') || req.body.author,
      genre: req.body.genre,
      price: req.body.price,
      description: details.description || req.body.description,
      imageUrl: imageUrl || 'https://via.placeholder.com/128x192.png?text=No+Image+Available'
    });

    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener un libro por ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const details = await getBookDetails(book.title);

    // Actualiza solo si los datos obtenidos son válidos
    book.description = details.description !== 'No description available' ? details.description : book.description;
    book.authors = details.authors.length > 0 ? details.authors : book.authors;
    book.publishedDate = details.publishedDate !== 'No published date available' ? details.publishedDate : book.publishedDate;
    book.categories = details.categories.length > 0 ? details.categories : book.categories;

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
