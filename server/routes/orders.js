const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Create new order
router.post('/', optionalAuth, async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      delivery_address,
      delivery_city,
      payment_method = 'cod',
      total_amount,
      items
    } = req.body;

    // Validation
    if (!customer_name || !customer_email || !delivery_address || !total_amount || !items || items.length === 0) {
      return res.status(400).json({ 
        message: 'Customer details, delivery address, total amount, and items are required' 
      });
    }

    if (total_amount <= 0) {
      return res.status(400).json({ message: 'Total amount must be greater than 0' });
    }

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Create order
      const [orderResult] = await connection.execute(`
        INSERT INTO orders (user_id, customer_name, customer_email, customer_phone, delivery_address, delivery_city, payment_method, total_amount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [req.user?.id || null, customer_name, customer_email, customer_phone, delivery_address, delivery_city, payment_method, total_amount]);

      const orderId = orderResult.insertId;

      // Create order items
      for (const item of items) {
        await connection.execute(`
          INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
          VALUES (?, ?, ?, ?, ?)
        `, [orderId, item.id, item.name, item.quantity, item.price]);

        // Update product stock (optional - for inventory management)
        if (item.id) {
          await connection.execute(`
            UPDATE products 
            SET stock_quantity = stock_quantity - ? 
            WHERE id = ? AND stock_quantity >= ?
          `, [item.quantity, item.id, item.quantity]);
        }
      }

      await connection.commit();

      // Get created order with items
      const [orders] = await connection.execute(`
        SELECT o.*, 
               GROUP_CONCAT(oi.product_name, ' (', oi.quantity, ')') as items_summary
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.id = ?
        GROUP BY o.id
      `, [orderId]);

      res.status(201).json({
        message: 'Order created successfully',
        order: orders[0]
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Get user orders (authenticated users)
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const [orders] = await pool.execute(`
      SELECT o.*, 
             GROUP_CONCAT(oi.product_name, ' (', oi.quantity, ')') as items_summary
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [req.user.id]);

    res.json({ orders });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Failed to get orders' });
  }
});

// Get order details (authenticated users or admin)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get order
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[0];

    // Check if user can access this order
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get order items
    const [orderItems] = await pool.execute(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id]
    );

    res.json({
      order: {
        ...order,
        items: orderItems
      }
    });

  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({ message: 'Failed to get order details' });
  }
});

// Get all orders (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT o.*, 
             GROUP_CONCAT(oi.product_name, ' (', oi.quantity, ')') as items_summary
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `;

    const params = [];

    if (status && status !== 'all') {
      query += ' WHERE o.status = ?';
      params.push(status);
    }

    query += ' GROUP BY o.id ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [orders] = await pool.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(DISTINCT o.id) as total FROM orders o';
    if (status && status !== 'all') {
      countQuery += ' WHERE o.status = ?';
    }
    const [countResult] = await pool.execute(countQuery, status && status !== 'all' ? [status] : []);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Failed to get orders' });
  }
});

// Update order status (admin only)
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validation
    const allowedStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Check if order exists
    const [existingOrders] = await pool.execute(
      'SELECT id FROM orders WHERE id = ?',
      [id]
    );

    if (existingOrders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status
    await pool.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({ message: 'Order status updated successfully' });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

// Get order statistics (admin only)
router.get('/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Total orders
    const [totalOrders] = await pool.execute('SELECT COUNT(*) as total FROM orders');
    
    // Total revenue
    const [totalRevenue] = await pool.execute('SELECT SUM(total_amount) as total FROM orders WHERE status != "cancelled"');
    
    // Orders by status
    const [ordersByStatus] = await pool.execute(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      GROUP BY status
    `);
    
    // Recent orders
    const [recentOrders] = await pool.execute(`
      SELECT * FROM orders 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    res.json({
      totalOrders: totalOrders[0].total,
      totalRevenue: totalRevenue[0].total || 0,
      ordersByStatus,
      recentOrders
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ message: 'Failed to get order statistics' });
  }
});

module.exports = router; 