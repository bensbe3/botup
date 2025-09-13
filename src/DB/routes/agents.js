const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('./db');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('./auth');

// Middleware to verify agent token
const verifyAgentToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get agent from database
    const [agents] = await pool.query(
      'SELECT * FROM agents WHERE id = ?', 
      [decoded.id]
    );
    
    if (agents.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    // Add agent to request
    req.agent = agents[0];
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Register a new agent (admin only)
router.post('/register', verifyToken, async (req, res) => {
  try {
    const { name, email, password, role = 'agent', clientId } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    
    // Validate client ID matches the authenticated client
    if (clientId && clientId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to add agents to this client' });
    }
    
    // Use authenticated client ID or the one provided
    const actualClientId = clientId || req.user.id;
    
    // Check if agent already exists
    const [existingAgents] = await pool.query(
      'SELECT * FROM agents WHERE email = ?', 
      [email]
    );
    
    if (existingAgents.length > 0) {
      return res.status(400).json({ error: 'Agent with this email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert new agent
    const [result] = await pool.query(
      'INSERT INTO agents (client_id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [actualClientId, name, email, hashedPassword, role]
    );
    
    res.status(201).json({ 
      success: true,
      id: result.insertId,
      name,
      email,
      role,
      clientId: actualClientId
    });
  } catch (err) {
    console.error('Error creating agent:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Agent login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find agent
    const [agents] = await pool.query(
      'SELECT * FROM agents WHERE email = ?',
      [email]
    );
    
    if (agents.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const agent = agents[0];
    
    // Check password
    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Update status
    await pool.query(
      'UPDATE agents SET status = "online", last_active = CURRENT_TIMESTAMP WHERE id = ?',
      [agent.id]
    );
    
    // Create token
    const token = jwt.sign(
      { id: agent.id, email: agent.email, role: agent.role, clientId: agent.client_id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.json({ 
      success: true,
      token,
      agent: {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        role: agent.role,
        clientId: agent.client_id,
        status: 'online'
      }
    });
  } catch (err) {
    console.error('Agent login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update agent status
router.put('/status', verifyAgentToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['online', 'away', 'offline'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    await pool.query(
      'UPDATE agents SET status = ?, last_active = CURRENT_TIMESTAMP WHERE id = ?',
      [status, req.agent.id]
    );
    
    res.json({ success: true, status });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get agents for a client
router.get('/client/:clientId', verifyToken, async (req, res) => {
  try {
    const clientId = req.params.clientId;
    
    // Check if client ID matches the authenticated client
    if (clientId != req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view these agents' });
    }
    
    const [agents] = await pool.query(
      'SELECT id, name, email, role, status, last_active, avatar FROM agents WHERE client_id = ?',
      [clientId]
    );
    
    res.json(agents);
  } catch (err) {
    console.error('Error fetching agents:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get the authenticated agent's profile
router.get('/profile', verifyAgentToken, async (req, res) => {
  try {
    const agent = {
      id: req.agent.id,
      name: req.agent.name,
      email: req.agent.email,
      role: req.agent.role,
      status: req.agent.status,
      clientId: req.agent.client_id,
      avatar: req.agent.avatar,
      lastActive: req.agent.last_active
    };
    
    res.json(agent);
  } catch (err) {
    console.error('Error fetching agent profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update agent profile
router.put('/profile', verifyAgentToken, async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    
    // Validate input
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (avatar) updates.avatar = avatar;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    // Check if email already exists if trying to change it
    if (email && email !== req.agent.email) {
      const [existingAgents] = await pool.query(
        'SELECT id FROM agents WHERE email = ? AND id != ?',
        [email, req.agent.id]
      );
      
      if (existingAgents.length > 0) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }
    
    // Build dynamic update query
    const fields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(req.agent.id); // Add agent ID for WHERE clause
    
    await pool.query(
      `UPDATE agents SET ${fields} WHERE id = ?`,
      values
    );
    
    res.json({ 
      success: true,
      agent: {
        ...req.agent,
        ...updates
      }
    });
  } catch (err) {
    console.error('Error updating agent profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Change agent password
router.put('/password', verifyAgentToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, req.agent.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    await pool.query(
      'UPDATE agents SET password = ? WHERE id = ?',
      [hashedPassword, req.agent.id]
    );
    
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an agent (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const agentId = req.params.id;
    
    // Get agent to check client ID
    const [agents] = await pool.query(
      'SELECT * FROM agents WHERE id = ?',
      [agentId]
    );
    
    if (agents.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    // Check if agent belongs to the authenticated client
    if (agents[0].client_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this agent' });
    }
    
    // Delete agent
    await pool.query('DELETE FROM agents WHERE id = ?', [agentId]);
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting agent:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Make verifyAgentToken available for use in other routes
module.exports = router;
module.exports.verifyAgentToken = verifyAgentToken; 