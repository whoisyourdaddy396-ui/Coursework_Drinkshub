const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all products (public)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, search, sort = 'name', order = 'ASC' } = req.query;
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    // Filter by category
    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    // Search functionality
    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Sorting
    const allowedSortFields = ['name', 'price', 'category', 'created_at'];
    const allowedOrders = ['ASC', 'DESC'];
    
    if (allowedSortFields.includes(sort) && allowedOrders.includes(order.toUpperCase())) {
      query += ` ORDER BY ${sort} ${order.toUpperCase()}`;
    } else {
      query += ' ORDER BY name ASC';
    }

    const [products] = await pool.execute(query, params);

    res.json({
      products,
      total: products.length
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Failed to get products' });
  }
});

// Get single product (public)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product: products[0] });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Failed to get product' });
  }
});

// Create new product (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      description,
      alcohol_content,
      volume,
      origin,
      image,
      stock_quantity = 0
    } = req.body;

    // Validation
    if (!name || !category || !price || !description) {
      return res.status(400).json({ 
        message: 'Name, category, price, and description are required' 
      });
    }

    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    // Insert product
    const [result] = await pool.execute(`
      INSERT INTO products (name, category, price, description, alcohol_content, volume, origin, image, stock_quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, category, price, description, alcohol_content, volume, origin, image, stock_quantity]);

    // Get created product
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Product created successfully',
      product: products[0]
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// Update product (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      price,
      description,
      alcohol_content,
      volume,
      origin,
      image,
      stock_quantity
    } = req.body;

    // Check if product exists
    const [existingProducts] = await pool.execute(
      'SELECT id FROM products WHERE id = ?',
      [id]
    );

    if (existingProducts.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Validation
    if (!name || !category || !price || !description) {
      return res.status(400).json({ 
        message: 'Name, category, price, and description are required' 
      });
    }

    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    // Update product
    await pool.execute(`
      UPDATE products 
      SET name = ?, category = ?, price = ?, description = ?, 
          alcohol_content = ?, volume = ?, origin = ?, image = ?, stock_quantity = ?
      WHERE id = ?
    `, [name, category, price, description, alcohol_content, volume, origin, image, stock_quantity, id]);

    // Get updated product
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Product updated successfully',
      product: products[0]
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const [existingProducts] = await pool.execute(
      'SELECT id FROM products WHERE id = ?',
      [id]
    );

    if (existingProducts.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete product
    await pool.execute('DELETE FROM products WHERE id = ?', [id]);

    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

// Get product categories (public)
router.get('/categories/list', async (req, res) => {
  try {
    const [categories] = await pool.execute(
      'SELECT DISTINCT category FROM products ORDER BY category'
    );

    const categoryList = categories.map(cat => cat.category);

    res.json({ categories: categoryList });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Failed to get categories' });
  }
});

// Get products by category (public)
router.get('/category/:category', optionalAuth, async (req, res) => {
  try {
    const { category } = req.params;
    const { sort = 'name', order = 'ASC' } = req.query;

    let query = 'SELECT * FROM products WHERE category = ?';
    const params = [category];

    // Sorting
    const allowedSortFields = ['name', 'price', 'created_at'];
    const allowedOrders = ['ASC', 'DESC'];
    
    if (allowedSortFields.includes(sort) && allowedOrders.includes(order.toUpperCase())) {
      query += ` ORDER BY ${sort} ${order.toUpperCase()}`;
    } else {
      query += ' ORDER BY name ASC';
    }

    const [products] = await pool.execute(query, params);

    res.json({
      products,
      category,
      total: products.length
    });

  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ message: 'Failed to get products by category' });
  }
});

module.exports = router; 