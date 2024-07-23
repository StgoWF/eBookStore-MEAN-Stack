const axios = require('axios');

const getBookDetails = async (title) => {
  try {
    let bookDetails = null;

    // Primer intento con restricción de idioma
    let response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: title,
        key: process.env.GOOGLE_BOOKS_API_KEY,
        maxResults: 1,
        langRestrict: 'en'  // Restrict results to English
      }
    });

    if (response.data.items && response.data.items.length > 0) {
      bookDetails = response.data.items[0].volumeInfo;
    }

    // Si no se encuentran resultados válidos, realiza una segunda búsqueda sin restricción de idioma
    if (!bookDetails || !bookDetails.description || bookDetails.description === 'No description available') {
      response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
        params: {
          q: title,
          key: process.env.GOOGLE_BOOKS_API_KEY,
          maxResults: 1
        }
      });

      if (response.data.items && response.data.items.length > 0) {
        bookDetails = response.data.items[0].volumeInfo;
      }
    }

    if (bookDetails) {
      return {
        title: bookDetails.title || 'Unknown',
        authors: bookDetails.authors || ['Unknown'],
        publishedDate: bookDetails.publishedDate || 'No published date available',
        categories: bookDetails.categories || ['No categories available'],
        description: bookDetails.description || 'No description available',
        imageUrl: bookDetails.imageLinks ? bookDetails.imageLinks.thumbnail : 'https://via.placeholder.com/128x192.png?text=No+Image+Available'
      };
    }

    throw new Error('No book details found');
  } catch (error) {
    console.error(`Error fetching details for book "${title}":`, error.message);
    throw error;
  }
};

module.exports = getBookDetails;
