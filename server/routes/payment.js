// routes/payment.js
const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);

const client = new paypal.core.PayPalHttpClient(environment);

router.post('/create-order', async (req, res) => {
  const { totalAmount } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: totalAmount.toFixed(2)
      }
    }]
  });

  try {
    const order = await client.execute(request);
    console.log('Order:', order);  // Agregar este log para depuración
    res.json({ id: order.result.id });
  } catch (err) {
    console.error('Error creando la orden:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
