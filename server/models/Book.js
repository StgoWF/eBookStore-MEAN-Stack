const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  authors: { type: [String] },  // Agregar autores
  publishedDate: { type: String }, // Agregar fecha de publicación
  categories: { type: [String] }   // Agregar categorías
});

module.exports = mongoose.model('Book', bookSchema);
