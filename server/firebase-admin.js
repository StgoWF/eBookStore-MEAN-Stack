// server/firebase-admin.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Asegúrate de que la ruta sea correcta

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ebookemporium-35f6d.firebaseio.com" // Asegúrate de que esta URL sea correcta
});

module.exports = admin;
