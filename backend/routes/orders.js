const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// --- GET /api/orders - Fetch all orders for the logged-in user ---
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.userId;

  try {
    // THE FIX IS ON THIS LINE:
    // We changed 'created_at' to 'order_date' to match your database table.
    const [orders] = await db.query(
      'SELECT id, order_date, total_amount FROM orders WHERE user_id = ? ORDER BY order_date DESC', 
      [userId]
    );

    if (orders.length === 0) {
      return res.json([]);
    }

    for (const order of orders) {
      const [items] = await db.query(`
        SELECT oi.quantity, oi.price_at_purchase, p.name, p.image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
      
      // We create a new 'created_at' property so the frontend component doesn't need to change.
      order.created_at = order.order_date;
      delete order.order_date; // Clean up the old property name
      order.items = items;
    }

    res.json(orders);

  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders.' });
  }
});


// --- POST /api/orders - Create a new order ---
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Cannot place an empty order.' });
  }

  try {
    let totalAmount = 0;
    for (const item of items) {
      const [productRows] = await db.query('SELECT price FROM products WHERE id = ?', [item.product.id]);
      const product = productRows[0];
      if (!product) { throw new Error(`Product with ID ${item.product.id} not found.`); }
      totalAmount += product.price * item.quantity;
    }

    // THE FIX IS ALSO ON THIS LINE:
    // This query now explicitly sets the `order_date` using NOW().
    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, total_amount, order_date) VALUES (?, ?, NOW())',
      [userId, totalAmount]
    );
    const orderId = orderResult.insertId;

    const orderItemsValues = items.map(item => [orderId, item.product.id, item.quantity, item.product.price]);
    
    await db.query(
      'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ?',
      [orderItemsValues]
    );

    res.status(201).json({ message: 'Order created successfully!', orderId: orderId });

  } catch (error) {
    console.error('Failed to create order:', error);
    res.status(500).json({ message: 'Server error while placing order.' });
  }
});

module.exports = router;

