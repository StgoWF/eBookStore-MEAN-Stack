const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('../firebase-admin'); // Importa firebase-admin

// Registrar usuario
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('Registro de usuario solicitado:', { username, email, password });
    const user = new User({ username, email, password });
    await user.save();
    console.log('Usuario registrado:', user);
    res.status(201).send({ message: 'User registered' });
  } catch (error) {
    console.error('Error en el registro de usuario:', error);
    res.status(400).send(error.message);
  }
});

// Iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Inicio de sesión solicitado:', { email, password });
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Usuario no encontrado:', email);
      return res.status(400).send('Invalid credentials');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Resultado de la comparación de contraseñas:', passwordMatch);
    if (!passwordMatch) {
      console.log('Credenciales inválidas para el usuario:', email);
      return res.status(400).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generado:', token);
    res.json({ token, userId: user._id });
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    res.status(400).send(error.message);
  }
});

// Registrar o iniciar sesión con Firebase
router.post('/firebase-auth', async (req, res) => {
  const { token } = req.body;

  try {
    // Verificar el token de Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name } = decodedToken;

    // Buscar el usuario en la base de datos
    let user = await User.findOne({ email });

    if (!user) {
      // Si el usuario no existe, crear uno nuevo
      user = new User({ username: name || email, email, password: '', firebaseUid: uid });
      await user.save();
    }

    // Crear un token JWT local
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token: jwtToken, userId: user._id });
  } catch (error) {
    console.error('Error al verificar el token de Firebase:', error);
    res.status(401).send('Unauthorized');
  }
});

module.exports = router;
