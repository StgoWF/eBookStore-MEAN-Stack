// server/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Book = require('../models/Book'); // Ensure you have this

// Obtener el carrito del usuario
router.get('/', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' }); // Si el usuario no está autenticado
    }
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.book');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Agregar un libro al carrito
router.post('/', auth, async (req, res) => {
  const { bookId, quantity } = req.body;
  if (!bookId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid bookId or quantity' });
  }

  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }
    const existingItem = cart.items.find(item => item.book.toString() === bookId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      cart.items.push({ book: bookId, quantity });
    }
    await cart.save();
    const populatedCart = await cart.populate('items.book').execPopulate();
    res.json(populatedCart);
  } catch (error) {
    console.error('Error adding item to cart:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// Eliminar un libro específico del carrito
router.delete('/item/:bookId', async (req, res) => {
  const { userId } = req.query; // Tomamos userId del query param
  const { bookId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    const populatedCart = await cart.populate('items.book').execPopulate();
    res.json(populatedCart);
  } catch (error) {
    console.error('Error deleting item from cart:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Ruta para vaciar el carrito
router.delete('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    cart.items = [];
    await cart.save();
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Actualizar la cantidad de un libro en el carrito
router.put('/item/:bookId', auth, async (req, res) => {
  const { bookId } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.book.toString() === bookId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.book.toString() !== bookId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    const populatedCart = await cart.populate('items.book').execPopulate();
    res.json(populatedCart);
  } catch (error) {
    console.error('Error updating item quantity:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
