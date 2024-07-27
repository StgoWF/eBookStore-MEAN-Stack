const axios = require('axios');
require('dotenv').config(); // Ensure .env variables are loaded

const getBookDetails = async (title, delayTime = 1000) => {
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  try {
    let bookDetails = null;

    // First attempt with language restriction
    let response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: title,
        key: process.env.GOOGLE_BOOKS_API_KEY,
        maxResults: 1,
        langRestrict: 'en'
      }
    });

    await delay(delayTime);  // Introduce delay

    if (response.data.items && response.data.items.length > 0) {
      bookDetails = response.data.items[0].volumeInfo;
    }

    // Second attempt without language restriction
    if (!bookDetails || !bookDetails.description || bookDetails.description === 'No description available') {
      response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
        params: {
          q: title,
          key: process.env.GOOGLE_BOOKS_API_KEY,
          maxResults: 1
        }
      });

      await delay(delayTime);  // Introduce delay

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

// Test function to fetch details for multiple books
const testGetBookDetails = async () => {
  const titles = [
    "The Great Gatsby",
    "1984",
    "To Kill a Mockingbird",
    "The Catcher in the Rye",
    "The Hobbit"
  ];

  for (const title of titles) {
    try {
      const details = await getBookDetails(title);
      console.log(`Details for "${title}":`, details);
    } catch (error) {
      console.error(`Failed to fetch details for "${title}":`, error.message);
    }
  }
};

testGetBookDetails();
