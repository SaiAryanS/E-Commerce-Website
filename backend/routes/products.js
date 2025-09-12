const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
});

// GET a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(products[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product.' });
  }
});

// POST a new product (Admin only)
router.post('/', authMiddleware, async (req, res) => {
  const { name, description, items_included, price, image_url, slug } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO products (name, description, items_included, price, image_url, slug) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, items_included, price, image_url, slug]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product.' });
  }
});

// DELETE a product (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product.' });
  }
});

module.exports = router;
