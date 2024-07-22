const axios = require('axios');

const getBookImage = async (title) => {
  try {
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: title,
        key: process.env.GOOGLE_BOOKS_API_KEY,
        maxResults: 1
      }
    });

    if (response.data.items && response.data.items.length > 0) {
      const book = response.data.items[0];
      if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
        return book.volumeInfo.imageLinks.thumbnail;
      }
    }

    throw new Error('No image found');
  } catch (error) {
    console.error(`Error fetching image for book "${title}":`, error.message);
    throw error;
  }
};

module.exports = getBookImage;
