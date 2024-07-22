const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('Authorization').replace('Bearer ', '');
  console.log('Token received:', token); // Log para verificar el token recibido
  if (!token) {
    console.log('Access denied. No token provided.');
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified:', decoded); // Log para verificar el token decodificado
    req.user = decoded;
    next();
  } catch (ex) {
    console.log('Invalid token');
    res.status(400).send('Invalid token.');
  }
}

module.exports = auth;
