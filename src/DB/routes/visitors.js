const express = require('express');
const router = express.Router();
const pool = require('./db');
const { verifyToken } = require('./auth');

// Track new visitor
router.post('/track', async (req, res) => {
  const { 
    botId, 
    url, 
    referrer, 
    userAgent, 
    screenSize, 
    timezone,
    language
  } = req.body;
  
  try {
    // Get IP info (with fallbacks)
    const ip = req.headers['x-forwarded-for'] || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress || 
               req.connection.socket.remoteAddress;
    
    // Validate botId
    if (!botId) {
      return res.status(400).json({ error: 'botId is required' });
    }
    
    // Verify the bot exists
    const [bots] = await pool.query(
      'SELECT id FROM chatbots WHERE id = ?',
      [botId]
    );
    
    if (bots.length === 0) {
      return res.status(404).json({ error: 'Bot not found' });
    }
    
    // Store visitor data
    const [result] = await pool.query(
      `INSERT INTO visitors (
        bot_id, current_url, referrer, user_agent, 
        screen_size, ip_address, timezone, language, 
        first_seen, last_seen, is_online
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), TRUE)`,
      [botId, url, referrer, userAgent, screenSize, ip, timezone, language]
    );
    
    res.json({ success: true, visitorId: result.insertId });
  } catch (err) {
    console.error('Error tracking visitor:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update visitor data
router.put('/:id', async (req, res) => {
  const visitorId = req.params.id;
  const { url, isOnline } = req.body;
  
  try {
    // Verify visitor exists
    const [visitors] = await pool.query(
      'SELECT id FROM visitors WHERE id = ?',
      [visitorId]
    );
    
    if (visitors.length === 0) {
      return res.status(404).json({ error: 'Visitor not found' });
    }
    
    // Update visitor data
    await pool.query(
      'UPDATE visitors SET current_url = ?, is_online = ?, last_seen = NOW() WHERE id = ?',
      [url, isOnline !== undefined ? isOnline : true, visitorId]
    );
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating visitor:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get visitors for a bot (requires authentication)
router.get('/bot/:botId', verifyToken, async (req, res) => {
  const botId = req.params.botId;
  
  try {
    // Verify the bot belongs to this client
    const [bots] = await pool.query(
      'SELECT id FROM chatbots WHERE id = ? AND client_id = ?',
      [botId, req.user.id]
    );
    
    if (bots.length === 0) {
      return res.status(404).json({ error: 'Bot not found or not authorized' });
    }
    
    // Get visitors - only those active in the last 30 minutes
    const [visitors] = await pool.query(
      `SELECT * FROM visitors 
       WHERE bot_id = ? AND last_seen > DATE_SUB(NOW(), INTERVAL 30 MINUTE)
       ORDER BY is_online DESC, last_seen DESC`,
      [botId]
    );
    
    res.json(visitors);
  } catch (err) {
    console.error('Error fetching visitors:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all visitors for a client (across all bots)
router.get('/client', verifyToken, async (req, res) => {
  try {
    // Get all bots for this client
    const [bots] = await pool.query(
      'SELECT id FROM chatbots WHERE client_id = ?',
      [req.user.id]
    );
    
    if (bots.length === 0) {
      return res.json([]);
    }
    
    const botIds = bots.map(bot => bot.id);
    
    // Get visitors across all bots for this client
    const [visitors] = await pool.query(
      `SELECT v.*, c.name AS bot_name
       FROM visitors v
       JOIN chatbots c ON v.bot_id = c.id
       WHERE v.bot_id IN (?) AND v.last_seen > DATE_SUB(NOW(), INTERVAL 30 MINUTE)
       ORDER BY v.is_online DESC, v.last_seen DESC`,
      [botIds]
    );
    
    res.json(visitors);
  } catch (err) {
    console.error('Error fetching client visitors:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get visitor details with conversations
router.get('/:id', verifyToken, async (req, res) => {
  const visitorId = req.params.id;
  
  try {
    // Get visitor with security check
    const [visitors] = await pool.query(
      `SELECT v.*, c.name AS bot_name, c.client_id
       FROM visitors v
       JOIN chatbots c ON v.bot_id = c.id 
       WHERE v.id = ? AND c.client_id = ?`,
      [visitorId, req.user.id]
    );
    
    if (visitors.length === 0) {
      return res.status(404).json({ error: 'Visitor not found or not authorized' });
    }
    
    // Get visitor's conversations
    const [conversations] = await pool.query(
      `SELECT * FROM conversations
       WHERE visitor_id = ?
       ORDER BY created_at DESC`,
      [visitorId]
    );
    
    // Format response
    const visitor = {
      ...visitors[0],
      conversations: conversations
    };
    
    res.json(visitor);
  } catch (err) {
    console.error('Error fetching visitor details:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 