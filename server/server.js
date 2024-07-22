require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('./firebase-admin'); // Importa firebase-admin
const jwt = require('jsonwebtoken'); // Asegúrate de tener esta línea

const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
  seedBooks();  // Llamar a la función seedBooks para insertar datos de prueba
});

// Middleware para verificar tokens de Firebase y JWT
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send('Unauthorized');
  }

  const token = authHeader.split('Bearer ')[1];

  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  try {
    // Primero intenta verificar el token como un token de Firebase
    const decodedFirebaseToken = await admin.auth().verifyIdToken(token);
    console.log('Firebase token verified:', decodedFirebaseToken);
    req.user = { id: decodedFirebaseToken.uid }; // Usar uid como id del usuario
    return next();
  } catch (error) {
    console.log('Firebase token verification failed:', error.message);
  }

  try {
    // Si falla, intenta verificar el token como un token JWT local
    const decodedJwtToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log('JWT token verified:', decodedJwtToken);
    req.user = decodedJwtToken;
    return next();
  } catch (error) {
    console.log('JWT token verification failed:', error.message);
    return res.status(401).send('Unauthorized');
  }
};

// Usar las rutas sin verificación de token para libros y autenticación
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);

// Usar las rutas con verificación de token para el carrito
app.use('/api/cart', verifyToken, cartRoutes);

// Función para insertar datos de prueba
async function seedBooks() {
  const Book = require('./models/Book'); // Asegúrate de importar el modelo aquí
  const books = [
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Fiction',
      price: 10.99,
      description: 'A novel set in the Jazz Age on Long Island, near New York City.',
    },
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Fiction',
      price: 8.99,
      description: 'A novel about the serious issues of rape and racial inequality.',
    },
    {
      title: '1984',
      author: 'George Orwell',
      genre: 'Dystopian',
      price: 9.99,
      description: 'A novel that tells the story of a dystopian society under totalitarian rule.',
    },
  ];

  try {
    await Book.deleteMany({}); // Elimina todos los libros existentes
    await Book.insertMany(books); // Inserta los libros de prueba
    console.log('Seed data inserted successfully');
  } catch (err) {
    console.error('Error inserting seed data:', err);
  }
}
