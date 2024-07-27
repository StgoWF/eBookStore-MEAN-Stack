const axios = require('axios');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getBookDetails = async (title, delayTime = 1000) => {
    let bookDetails = null;

    try {
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
            params: {
                q: title,
                key: process.env.GOOGLE_BOOKS_API_KEY,
                maxResults: 1,
                langRestrict: 'en'
            }
        });
        console.log('First attempt response', response.data);
        if (response.data.items && response.data.items.length > 0) {
            bookDetails = response.data.items[0].volumeInfo;
        }

        if (!bookDetails || bookDetails.description === 'No description available') {
            await delay(delayTime);
            const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
                params: {
                    q: title,
                    key: process.env.GOOGLE_BOOKS_API_KEY,
                    maxResults: 1
                }
            });
            console.log('Second attempt response', response.data);
            if (response.data.items && response.data.items.length > 0) {
                bookDetails = response.data.items[0].volumeInfo;
            }
        }

        if (bookDetails) {
            console.log('Book details found: ', bookDetails);
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
