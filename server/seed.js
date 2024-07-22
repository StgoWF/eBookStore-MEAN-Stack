const mongoose = require('mongoose');
const Book = require('./models/Book');
const getBookImage = require('./services/bookImageService'); // Importa la función getBookImage
require('dotenv').config();


const books = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    description: 'A novel set in the Jazz Age on Long Island, near New York City.',
    price: 10.99
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    description: 'A novel about the serious issues of rape and racial inequality.',
    price: 8.99
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    description: 'A novel that tells the story of a dystopian society under totalitarian rule.',
    price: 9.99
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    description: 'A romantic novel that charts the emotional development of the protagonist Elizabeth Bennet.',
    price: 7.99
  },
  {
    title: 'Moby-Dick',
    author: 'Herman Melville',
    genre: 'Adventure',
    description: 'The narrative of Captain Ahab’s obsessive quest to seek revenge on Moby Dick.',
    price: 11.99
  },
  {
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    genre: 'Historical',
    description: 'A novel that chronicles the French invasion of Russia and the impact of the Napoleonic era.',
    price: 12.99
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Fiction',
    description: 'A story about adolescent alienation and loss of innocence in the protagonist Holden Caulfield.',
    price: 9.99
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    description: 'A fantasy novel and children\'s book by J. R. R. Tolkien. It was published on 21 September 1937.',
    price: 8.99
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    genre: 'Dystopian',
    description: 'A dystopian social science fiction novel and a cautionary tale, written by the English writer Aldous Huxley.',
    price: 10.99
  },
  {
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    genre: 'Romance',
    description: 'A novel that follows the experiences of its eponymous heroine, including her growth to adulthood and her love for Mr. Rochester.',
    price: 7.99
  },
  {
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    genre: 'Psychological Fiction',
    description: 'A novel about the mental anguish and moral dilemmas of an impoverished ex-student in Saint Petersburg who formulates a plan to kill an unscrupulous pawnbroker for her cash.',
    price: 9.99
  },
  {
    title: 'The Brothers Karamazov',
    author: 'Fyodor Dostoevsky',
    genre: 'Philosophical Fiction',
    description: 'A passionate philosophical novel set in 19th-century Russia, that enters deeply into the ethical debates of God, free will, and morality.',
    price: 11.99
  },
  {
    title: 'The Odyssey',
    author: 'Homer',
    genre: 'Epic',
    description: 'An epic poem attributed to Homer, it is one of the oldest works of literature still read by contemporary audiences.',
    price: 13.99
  },
  {
    title: 'Ulysses',
    author: 'James Joyce',
    genre: 'Modernist Novel',
    description: 'A modernist novel by Irish writer James Joyce. It was first serialized in parts in the American journal The Little Review from March 1918 to December 1920.',
    price: 14.99
  },
  {
    title: 'The Divine Comedy',
    author: 'Dante Alighieri',
    genre: 'Epic Poetry',
    description: 'An Italian long narrative poem by Dante Alighieri, begun in 1308 and completed in 1320, a year before his death in 1321.',
    price: 15.99
  },
  {
    title: 'Frankenstein',
    author: 'Mary Shelley',
    genre: 'Gothic Fiction',
    description: 'A novel written by English author Mary Shelley that tells the story of Victor Frankenstein, a young scientist who creates a sapient creature in an unorthodox scientific experiment.',
    price: 8.99
  },
  {
    title: 'Dracula',
    author: 'Bram Stoker',
    genre: 'Gothic Fiction',
    description: 'A novel by Irish author Bram Stoker, featuring as its primary antagonist the vampire Count Dracula.',
    price: 9.99
  },
  {
    title: 'Great Expectations',
    author: 'Charles Dickens',
    genre: 'Fiction',
    description: 'The story of the orphan Pip, writing his life from his early days of childhood until adulthood and trying to be a gentleman along the way.',
    price: 10.99
  },
  {
    title: 'The Grapes of Wrath',
    author: 'John Steinbeck',
    genre: 'Historical Fiction',
    description: 'An American realist novel written by John Steinbeck and published in 1939. The book won the National Book Award and Pulitzer Prize for Fiction.',
    price: 12.99
  },
  {
    title: 'Anna Karenina',
    author: 'Leo Tolstoy',
    genre: 'Fiction',
    description: 'A novel by the Russian author Leo Tolstoy, first published in book form in 1878. Many authors consider it to be one of the greatest works of literature ever written.',
    price: 11.99
  },
  {
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    genre: 'Philosophical Fiction',
    description: 'A novel by Oscar Wilde, first published in 1890. It tells of a young man named Dorian Gray, the subject of a painting by artist Basil Hallward.',
    price: 7.99
  },
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    description: 'An epic high-fantasy novel written by English author and scholar J. R. R. Tolkien. The story began as a sequel to Tolkien\'s 1937 fantasy novel The Hobbit.',
    price: 20.99
  },
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    description: 'A fantasy novel written by British author J. K. Rowling. The first novel in the Harry Potter series and Rowling\'s debut novel.',
    price: 9.99
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Fiction',
    description: 'A novel by Brazilian author Paulo Coelho that was first published in 1988. Originally written in Portuguese, it became a widely translated international bestseller.',
    price: 10.99
  },
  {
    title: 'The Old Man and the Sea',
    author: 'Ernest Hemingway',
    genre: 'Fiction',
    description: 'A short novel written by the American author Ernest Hemingway in 1951 in Cuba, and published in 1952.',
    price: 8.99
  },
  {
    title: 'Lolita',
    author: 'Vladimir Nabokov',
    genre: 'Fiction',
    description: 'A novel written by Russian-American novelist Vladimir Nabokov. The novel is notable for its controversial subject.',
    price: 10.99
  },
  {
    title: 'Catch-22',
    author: 'Joseph Heller',
    genre: 'Satire',
    description: 'A satirical war novel by American author Joseph Heller. He began writing it in 1953; the novel was first published in 1961.',
    price: 9.99
  },
  {
    title: 'The Sound and the Fury',
    author: 'William Faulkner',
    genre: 'Fiction',
    description: 'A novel written by the American author William Faulkner. It employs a number of narrative styles, including stream of consciousness.',
    price: 9.99
  },
  {
    title: 'One Hundred Years of Solitude',
    author: 'Gabriel Garcia Marquez',
    genre: 'Magical Realism',
    description: 'A landmark 1967 novel by Colombian author Gabriel García Márquez that tells the multi-generational story of the Buendía family.',
    price: 12.99
  }
];

async function seedBooks() {
  try {
    await Book.deleteMany({}); // Elimina todos los libros existentes

    // Insertar libros de prueba con la URL de la imagen
    const booksWithImages = await Promise.all(books.map(async (book) => {
      try {
        const imageUrl = await getBookImage(book.title);
        return { ...book, imageUrl };
      } catch (error) {
        console.error(`Error obtaining image for book "${book.title}":`, error.message);
        return book; // Si hay un error, devuelve el libro sin la URL de la imagen
      }
    }));

    await Book.insertMany(booksWithImages); // Inserta los libros de prueba
    console.log('Seed data inserted successfully');
  } catch (err) {
    console.error('Error inserting seed data:', err);
  }
}

module.exports = seedBooks;