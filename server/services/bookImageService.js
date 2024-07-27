const axios = require('axios');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const getBookImage = async (title, delayTime = 1000) => {
  try {
    let imageUrl = null;

    // First attempt with language restriction
    let response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: title,
        key: process.env.GOOGLE_BOOKS_API_KEY,
        maxResults: 1
      }
    });

    await delay(delayTime);  // Introduce delay

    if (response.data.items && response.data.items.length > 0) {
      const book = response.data.items[0];
      if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
        imageUrl = book.volumeInfo.imageLinks.thumbnail;
      }
    }

    // Second attempt without language restriction
    if (!imageUrl) {
      response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
        params: {
          q: title,
          key: process.env.GOOGLE_BOOKS_API_KEY,
          maxResults: 1,
          langRestrict: 'en'
        }
      });

      await delay(delayTime);  // Introduce delay

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
