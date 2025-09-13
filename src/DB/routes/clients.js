const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('./db');
const { verifyToken } = require('./auth');

// Get client profile
router.get('/profile', verifyToken, (req, res) => {
  // Convert MySQL datetime format to JS Date object
  const user = {
    ...req.user,
    created_at: new Date(req.user.created_at),
    last_login: req.user.last_login ? new Date(req.user.last_login) : null
  };
  
  res.json(user);
});

// Update client profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, email, site, company } = req.body;
    
    // Input validation
    if (!name || !email || !site) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Check if email is already used by another user
    if (email !== req.user.email) {
      const [existingUsers] = await pool.query(
        'SELECT * FROM my_clients WHERE email = ? AND id != ?', 
        [email, req.user.id]
      );
      
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }
    
    // Update user
    await pool.query(
      'UPDATE my_clients SET name = ?, email = ?, site = ?, company = ? WHERE id = ?',
      [name, email, site, company || null, req.user.id]
    );
    
    // Get updated user data
    const [users] = await pool.query(
      'SELECT id, name, email, site, plan, company, created_at FROM my_clients WHERE id = ?',
      [req.user.id]
    );
    
    // Format dates
    const user = {
      ...users[0],
      created_at: new Date(users[0].created_at),
      last_login: users[0].last_login ? new Date(users[0].last_login) : null
    };
    
    res.json(user);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upgrade plan
router.post('/upgrade-plan', verifyToken, async (req, res) => {
  try {
    const { plan } = req.body;
    
    // Input validation
    if (!plan || !['free', 'pro', 'enterprise'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan' });
    }
    
    // Update plan
    await pool.query(
      'UPDATE my_clients SET plan = ? WHERE id = ?',
      [plan, req.user.id]
    );
    
    // Here you would implement payment processing logic
    // For a real application, integrate with Stripe, PayPal, etc.
    
    res.json({ message: 'Plan upgraded successfully', plan });
  } catch (err) {
    console.error('Plan upgrade error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;