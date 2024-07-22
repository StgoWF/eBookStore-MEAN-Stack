const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    console.log('User in getCart:', req.user); // Log para el usuario en la solicitud
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      console.log('Cart not found for user:', req.user.id); // Log para carrito no encontrado
      return res.status(404).send({ message: 'Cart not found' });
    }
    console.log('Cart found:', cart); // Log para carrito encontrado
    res.send(cart);
  } catch (error) {
    console.error('Error in getCart:', error); // Log para errores
    res.status(500).send({ message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    console.log('User in addToCart:', req.user); // Log para el usuario en la solicitud
    console.log('BookId:', bookId, 'Quantity:', quantity); // Log para datos del libro

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      console.log('Creating new cart for user:', req.user.id); // Log para creación del carrito
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);
    if (itemIndex === -1) {
      cart.items.push({ book: bookId, quantity });
    } else {
      cart.items[itemIndex].quantity += quantity;
    }

    await cart.save();
    console.log('Cart after adding item:', cart); // Log para carrito después de agregar el libro
    res.send(cart);
  } catch (error) {
    console.error('Error in addToCart:', error); // Log para errores
    res.status(500).send({ message: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    console.log('User in clearCart:', req.user); // Log para el usuario en la solicitud
    const cart = await Cart.findOneAndDelete({ user: req.user.id });
    if (!cart) {
      console.log('Cart not found for user:', req.user.id); // Log para carrito no encontrado
      return res.status(404).send({ message: 'Cart not found' });
    }
    console.log('Cart cleared for user:', req.user.id); // Log para carrito borrado
    res.send({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error in clearCart:', error); // Log para errores
    res.status(500).send({ message: error.message });
  }
};
