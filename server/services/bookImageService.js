const axios = require('axios');

const getBookImage = async (title) => {
  try {
    let imageUrl = null;

    // Primer intento con restricción de idioma
    let response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: title,
        key: process.env.GOOGLE_BOOKS_API_KEY,
        maxResults: 1
      }
    });

    if (response.data.items && response.data.items.length > 0) {
      const book = response.data.items[0];
      if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
        imageUrl = book.volumeInfo.imageLinks.thumbnail;
      }
    }

    // Si no se encuentra una imagen válida, realiza una segunda búsqueda sin restricción de idioma
    if (!imageUrl) {
      response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
        params: {
          q: title,
          key: process.env.GOOGLE_BOOKS_API_KEY,
          maxResults: 1,
          langRestrict: 'en'

        }
      });

      if (response.data.items && response.data.items.length > 0) {
        const book = response.data.items[0];
        if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
          imageUrl = book.volumeInfo.imageLinks.thumbnail;
        }
      }
    }

    if (imageUrl) {
      return imageUrl;
    }

    throw new Error('No image found');
  } catch (error) {
    console.error(`Error fetching image for book "${title}":`, error.message);
    return 'https://via.placeholder.com/128x192.png?text=No+Image+Available';
  }
};

module.exports = getBookImage;
