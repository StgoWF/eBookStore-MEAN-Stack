const mongoose = require('mongoose');
const Book = require('./models/Book');
const getBookImage = require('./services/bookImageService'); // Importa la función getBookImage
const getBookDetails = require('./services/bookDetailService'); // Importa la función getBookDetails
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
  },
  {
    title: 'Don Quixote',
    author: 'Miguel de Cervantes',
    genre: 'Fiction',
    description: 'A Spanish novel by Miguel de Cervantes. It follows the adventures of a nobleman who reads so many chivalric romances that he loses his sanity and decides to become a knight-errant.',
    price: 11.99
  },
  {
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
    genre: 'Gothic Fiction',
    description: 'A novel by Emily Brontë published in 1847 under her pseudonym Ellis Bell. The narrative is non-linear, involving several flashbacks, and it focuses on the tragic story of Heathcliff and Catherine Earnshaw.',
    price: 8.99
  },
  {
    title: 'The Iliad',
    author: 'Homer',
    genre: 'Epic',
    description: 'An ancient Greek epic poem attributed to Homer. It tells the story of the Trojan War and the Greek siege of the city of Troy.',
    price: 12.99
  },
  {
    title: 'The Metamorphosis',
    author: 'Franz Kafka',
    genre: 'Absurdist Fiction',
    description: 'A novella by Franz Kafka, first published in 1915. It tells the story of a salesman who wakes one morning to find himself inexplicably transformed into a huge insect.',
    price: 7.99
  },
  {
    title: 'The Stranger',
    author: 'Albert Camus',
    genre: 'Philosophical Fiction',
    description: 'A novel by Albert Camus. Its theme and outlook are often cited as examples of Camus\' philosophy of the absurd and existentialism.',
    price: 9.99
  },
  {
    title: 'Beloved',
    author: 'Toni Morrison',
    genre: 'Historical Fiction',
    description: 'A novel by Toni Morrison. It is set after the American Civil War and tells the story of a family of former slaves whose Cincinnati home is haunted by a spirit.',
    price: 10.99
  },
  {
    title: 'The Aeneid',
    author: 'Virgil',
    genre: 'Epic',
    description: 'A Latin epic poem written by Virgil between 29 and 19 BC. It tells the legendary story of Aeneas, a Trojan who travelled to Italy, where he became the ancestor of the Romans.',
    price: 13.99
  },
  {
    title: 'Madame Bovary',
    author: 'Gustave Flaubert',
    genre: 'Literary Realism',
    description: 'A novel by Gustave Flaubert that focuses on a doctor\'s wife, Emma Bovary, who has adulterous affairs and lives beyond her means in order to escape the banalities and emptiness of provincial life.',
    price: 8.99
  },
  {
    title: 'The Count of Monte Cristo',
    author: 'Alexandre Dumas',
    genre: 'Adventure',
    description: 'A novel by Alexandre Dumas completed in 1844. It is an adventure story primarily concerned with themes of hope, justice, vengeance, mercy, and forgiveness.',
    price: 10.99
  },
  {
    title: 'The Scarlet Letter',
    author: 'Nathaniel Hawthorne',
    genre: 'Historical Fiction',
    description: 'A work of historical fiction by American author Nathaniel Hawthorne, published in 1850. It is set in 17th-century Puritan Massachusetts Bay Colony during the years 1642 to 1649.',
    price: 7.99
  },
  {
    title: 'Mansfield Park',
    author: 'Jane Austen',
    genre: 'Romance',
    description: 'The third published novel by Jane Austen, first published in 1814. The novel tells the story of Fanny Price starting when her overburdened family sends her at age ten to live in the household of her wealthy aunt and uncle.',
    price: 6.99
  },
  {
    title: 'David Copperfield',
    author: 'Charles Dickens',
    genre: 'Fiction',
    description: 'The eighth novel by Charles Dickens. The novel\'s full title is The Personal History, Adventures, Experience and Observation of David Copperfield the Younger of Blunderstone Rookery (which he never meant to publish on any account).',
    price: 11.99
  },
  {
    title: 'Les Misérables',
    author: 'Victor Hugo',
    genre: 'Historical Fiction',
    description: 'A French historical novel by Victor Hugo, first published in 1862, that is considered one of the greatest novels of the 19th century.',
    price: 14.99
  },
  {
    title: 'The Sun Also Rises',
    author: 'Ernest Hemingway',
    genre: 'Fiction',
    description: 'A 1926 novel by American writer Ernest Hemingway. It portrays American and British expatriates who travel from Paris to the Festival of San Fermín in Pamplona to watch the running of the bulls and the bullfights.',
    price: 9.99
  },
  {
    title: 'The Trial',
    author: 'Franz Kafka',
    genre: 'Absurdist Fiction',
    description: 'A novel written by Franz Kafka between 1914 and 1915 and published posthumously in 1925. The story of a man arrested and prosecuted by a remote, inaccessible authority, with the nature of his crime revealed neither to him nor to the reader.',
    price: 8.99
  },
  {
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    genre: 'Dystopian',
    description: 'A dystopian novel by American writer Ray Bradbury. It was first published in 1953 and is often regarded as one of his best works.',
    price: 7.99
  },
  {
    title: 'Animal Farm',
    author: 'George Orwell',
    genre: 'Political Satire',
    description: 'An allegorical novella by George Orwell, first published in England on 17 August 1945. The book tells the story of a group of farm animals who rebel against their human farmer, hoping to create a society where the animals can be equal, free, and happy.',
    price: 6.99
  },
  {
    title: 'Gone with the Wind',
    author: 'Margaret Mitchell',
    genre: 'Historical Fiction',
    description: 'A novel by American writer Margaret Mitchell, first published in 1936. The story is set in Clayton County and Atlanta, both in Georgia, during the American Civil War and Reconstruction Era.',
    price: 11.99
  },
  {
    title: 'The Adventures of Huckleberry Finn',
    author: 'Mark Twain',
    genre: 'Adventure',
    description: 'A novel by Mark Twain, first published in the United Kingdom in December 1884 and in the United States in February 1885. Commonly named among the Great American Novels.',
    price: 8.99
  },
  {
    title: 'The Adventures of Tom Sawyer',
    author: 'Mark Twain',
    genre: 'Adventure',
    description: 'A novel by Mark Twain about a young boy growing up along the Mississippi River. It is set in the 1840s in the fictional town of St. Petersburg, inspired by Hannibal, Missouri, where Twain lived as a boy.',
    price: 7.99
  },
  
  
  
];

async function seedBooks() {
  try {
    await Book.deleteMany({}); // Elimina todos los libros existentes

    // Insertar libros de prueba con la URL de la imagen
    const booksWithDetails = await Promise.all(books.map(async (book) => {
      try {
        const imageUrl = await getBookImage(book.title);
        const details = await getBookDetails(book.title);

        return {
          ...book,
          imageUrl,
          apiDescription: details.description,
          authors: details.authors,
          publishedDate: details.publishedDate,
          categories: details.categories,
        };

      } catch (error) {
        console.error(`Error obtaining image for book "${book.title}":`, error.message);
        return book; // Si hay un error, devuelve el libro sin la URL de la imagen
      }
    }));

    await Book.insertMany(booksWithDetails); // Inserta los libros de prueba
    console.log('Seed data inserted successfully');
  } catch (err) {
    console.error('Error inserting seed data:', err);
  }
}

module.exports = seedBooks;