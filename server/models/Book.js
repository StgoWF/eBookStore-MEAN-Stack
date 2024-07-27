// server/models/Book.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true }, // Seed data description
  imageUrl: { type: String },
  authors: { type: [String] },
  publishedDate: { type: String },
  categories: { type: [String] },
  apiDescription: { type: String } // Google Books API description
});

module.exports = mongoose.model('Book', BookSchema);
