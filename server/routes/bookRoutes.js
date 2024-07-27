const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const getBookDetails = require('../services/bookDetailService');

// Obtener todas las categorías
router.get('/categories', async (req, res) => {
  try {
    console.log('Fetching categories');
    const categories = await Book.distinct('genre');
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Obtener todos los libros con paginación
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const books = await Book.find().limit(limit).skip((page - 1) * limit);
    const totalBooks = await Book.countDocuments();
    const totalPages = Math.ceil(totalBooks / limit);

    res.json({
      books,
      totalBooks,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error('Error fetching books:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Obtener un libro por ID
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching book with ID:', req.params.id);
    const book = await Book.findById(req.params.id);
    if (!book) {
      console.log('Book not found');
      return res.status(404).json({ message: 'Book not found' });
    }

    const details = await getBookDetails(book.title);
    console.log('Details fetched:', details);

    book.apiDescription = details.description !== 'No description available' ? details.description : book.apiDescription;
    console.log('Book with apiDescription:', book);
    book.authors = details.authors.length > 0 ? details.authors : book.authors;
    book.publishedDate = details.publishedDate !== 'No published date available' ? details.publishedDate : book.publishedDate;
    book.categories = details.categories.length > 0 ? details.categories : book.categories;

    const updatedBook = await book.save();
    console.log('Book updated:', updatedBook);
    res.json(updatedBook);
  } catch (error) {
    console.error('Error fetching book by ID:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
