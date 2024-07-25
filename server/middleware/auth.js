const jwt = require('jsonwebtoken');
const admin = require('../firebase-admin'); // Importa firebase-admin

const auth = async (req, res, next) => {
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
    req.user = decodedFirebaseToken;
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

module.exports = auth;
