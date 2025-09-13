const express = require('express');
const router = express.Router();
const pool = require('./db');
const { verifyToken } = require('./auth');

// Get all conversations for client (across all chatbots)
router.get('/', verifyToken, async (req, res) => {
  try {
    // Get all chatbots for this client to ensure access permission
    const [chatbots] = await pool.query(
      'SELECT id FROM chatbots WHERE client_id = ?',
      [req.user.id]
    );
    
    if (chatbots.length === 0) {
      return res.json([]);
    }
    
    // Extract chatbot IDs
    const chatbotIds = chatbots.map(bot => bot.id);
    
    // Get all conversations for these chatbots
    const [conversations] = await pool.query(
      `SELECT c.*, b.name as chatbot_name
       FROM conversations c
       JOIN chatbots b ON c.chatbot_id = b.id
       WHERE c.chatbot_id IN (?)
       ORDER BY c.created_at DESC`,
      [chatbotIds]
    );
    
    // Format date fields
    const formattedConversations = conversations.map(conv => ({
      ...conv,
      created_at: new Date(conv.created_at),
      updated_at: new Date(conv.updated_at)
    }));
    
    res.json(formattedConversations);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get conversations for a specific chatbot
router.get('/chatbot/:chatbotId', verifyToken, async (req, res) => {
  try {
    const chatbotId = req.params.chatbotId;
    
    // Verify chatbot belongs to client
    const [chatbots] = await pool.query(
      'SELECT id FROM chatbots WHERE id = ? AND client_id = ?',
      [chatbotId, req.user.id]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Get conversations for this chatbot
    const [conversations] = await pool.query(
      `SELECT * FROM conversations
       WHERE chatbot_id = ?
       ORDER BY created_at DESC`,
      [chatbotId]
    );
    
    // Format date fields
    const formattedConversations = conversations.map(conv => ({
      ...conv,
      created_at: new Date(conv.created_at),
      updated_at: new Date(conv.updated_at)
    }));
    
    res.json(formattedConversations);
  } catch (err) {
    console.error('Error fetching conversations for chatbot:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific conversation with its messages
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const conversationId = req.params.id;
    
    // Get the conversation with security check
    const [conversations] = await pool.query(
      `SELECT c.* 
       FROM conversations c
       JOIN chatbots b ON c.chatbot_id = b.id
       WHERE c.id = ? AND b.client_id = ?`,
      [conversationId, req.user.id]
    );
    
    if (conversations.length === 0) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Get messages for this conversation
    const [messages] = await pool.query(
      `SELECT * FROM messages
       WHERE conversation_id = ?
       ORDER BY timestamp ASC`,
      [conversationId]
    );
    
    // Format date fields for conversation
    const conversation = {
      ...conversations[0],
      created_at: new Date(conversations[0].created_at),
      updated_at: new Date(conversations[0].updated_at),
      messages: messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    };
    
    res.json(conversation);
  } catch (err) {
    console.error('Error fetching conversation details:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new message to a conversation (for webhook/integration use)
router.post('/:id/messages', verifyToken, async (req, res) => {
  try {
    const conversationId = req.params.id;
    const { sender, content } = req.body;
    
    // Validate input
    if (!sender || !content || !['user', 'bot'].includes(sender)) {
      return res.status(400).json({ message: 'Invalid message data' });
    }
    
    // Security check - verify conversation belongs to a chatbot owned by this client
    const [conversations] = await pool.query(
      `SELECT c.id 
       FROM conversations c
       JOIN chatbots b ON c.chatbot_id = b.id
       WHERE c.id = ? AND b.client_id = ?`,
      [conversationId, req.user.id]
    );
    
    if (conversations.length === 0) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Add message
    const [result] = await pool.query(
      `INSERT INTO messages (conversation_id, sender, content)
       VALUES (?, ?, ?)`,
      [conversationId, sender, content]
    );
    
    // Update message count and last updated time in the conversation
    await pool.query(
      `UPDATE conversations 
       SET message_count = message_count + 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [conversationId]
    );
    
    // Get the newly created message
    const [messages] = await pool.query(
      'SELECT * FROM messages WHERE id = ?',
      [result.insertId]
    );
    
    // Format timestamp
    const message = {
      ...messages[0],
      timestamp: new Date(messages[0].timestamp)
    };
    
    res.status(201).json(message);
  } catch (err) {
    console.error('Error adding message to conversation:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new conversation (for webhook/integration use)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { chatbotId, customerName, customerEmail } = req.body;
    
    // Validate input
    if (!chatbotId) {
      return res.status(400).json({ message: 'Chatbot ID is required' });
    }
    
    // Verify chatbot belongs to client
    const [chatbots] = await pool.query(
      'SELECT id FROM chatbots WHERE id = ? AND client_id = ?',
      [chatbotId, req.user.id]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Create new conversation
    const [result] = await pool.query(
      `INSERT INTO conversations 
        (chatbot_id, customer_name, customer_email, message_count)
       VALUES (?, ?, ?, 0)`,
      [chatbotId, customerName || null, customerEmail || null]
    );
    
    // Get the newly created conversation
    const [conversations] = await pool.query(
      'SELECT * FROM conversations WHERE id = ?',
      [result.insertId]
    );
    
    // Format date fields
    const conversation = {
      ...conversations[0],
      created_at: new Date(conversations[0].created_at),
      updated_at: new Date(conversations[0].updated_at)
    };
    
    res.status(201).json(conversation);
  } catch (err) {
    console.error('Error creating conversation:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics data for a chatbot
router.get('/analytics/chatbot/:chatbotId', verifyToken, async (req, res) => {
  try {
    const chatbotId = req.params.chatbotId;
    
    // Verify chatbot belongs to client
    const [chatbots] = await pool.query(
      'SELECT id FROM chatbots WHERE id = ? AND client_id = ?',
      [chatbotId, req.user.id]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Get conversation counts
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as totalConversations FROM conversations WHERE chatbot_id = ?',
      [chatbotId]
    );
    
    // Get message counts
    const [messageResult] = await pool.query(
      `SELECT COUNT(*) as totalMessages 
       FROM messages m
       JOIN conversations c ON m.conversation_id = c.id
       WHERE c.chatbot_id = ?`,
      [chatbotId]
    );
    
    // Get satisfaction rate
    const [satisfactionResult] = await pool.query(
      `SELECT 
         COUNT(CASE WHEN satisfied = 1 THEN 1 END) as satisfiedCount,
         COUNT(*) as totalCount
       FROM conversations 
       WHERE chatbot_id = ?`,
      [chatbotId]
    );
    
    // Calculate satisfaction percentage
    const satisfactionRate = 
      satisfactionResult[0].totalCount > 0
        ? Math.round((satisfactionResult[0].satisfiedCount / satisfactionResult[0].totalCount) * 100)
        : 0;
    
    // Get messages by day for the last 7 days
    const [messagesByDayResult] = await pool.query(
      `SELECT 
         DATE(m.timestamp) as date,
         COUNT(*) as count
       FROM messages m
       JOIN conversations c ON m.conversation_id = c.id
       WHERE c.chatbot_id = ? AND 
             m.timestamp >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
       GROUP BY DATE(m.timestamp)
       ORDER BY date ASC`,
      [chatbotId]
    );
    
    // Format analytics data
    const analytics = {
      totalConversations: countResult[0].totalConversations,
      totalMessages: messageResult[0].totalMessages,
      averageResponseTime: 1.5, // Mock data - would need more complex calculation
      satisfactionRate,
      activeUsers: Math.round(countResult[0].totalConversations * 0.7), // Mock calculation
      messagesByDay: messagesByDayResult.map(item => ({
        date: item.date.toISOString().split('T')[0],
        count: item.count
      })),
      // Mock data for other analytics that would require more complex queries
      topTopics: [
        { topic: 'Pricing', count: 42 },
        { topic: 'Features', count: 38 },
        { topic: 'Support', count: 27 },
        { topic: 'Integration', count: 19 },
        { topic: 'Billing', count: 12 },
      ],
      satisfactionTrend: [
        { date: '2024-05-01', rate: 90 },
        { date: '2024-05-02', rate: 91 },
        { date: '2024-05-03', rate: 89 },
        { date: '2024-05-04', rate: 90 },
        { date: '2024-05-05', rate: 92 },
        { date: '2024-05-06', rate: 94 },
        { date: '2024-05-07', rate: 92 },
      ],
      responseTimeTrend: [
        { date: '2024-05-01', time: 1.8 },
        { date: '2024-05-02', time: 1.7 },
        { date: '2024-05-03', time: 1.6 },
        { date: '2024-05-04', time: 1.6 },
        { date: '2024-05-05', time: 1.5 },
        { date: '2024-05-06', time: 1.4 },
        { date: '2024-05-07', time: 1.5 },
      ],
    };
    
    res.json(analytics);
  } catch (err) {
    console.error('Error fetching chatbot analytics:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Transfer conversation to human agent
router.post('/:id/transfer', verifyToken, async (req, res) => {
  try {
    const conversationId = req.params.id;
    const { agentId, departmentId } = req.body;
    
    // Check if conversation exists and belongs to client
    const [conversations] = await pool.query(
      `SELECT c.* FROM conversations c
       JOIN chatbots b ON c.chatbot_id = b.id
       WHERE c.id = ? AND b.client_id = ?`,
      [conversationId, req.user.id]
    );
    
    if (conversations.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // If agent specified, verify agent belongs to client
    if (agentId) {
      const [agents] = await pool.query(
        'SELECT * FROM agents WHERE id = ? AND client_id = ?',
        [agentId, req.user.id]
      );
      
      if (agents.length === 0) {
        return res.status(404).json({ error: 'Agent not found' });
      }
    }
    
    // Update conversation
    await pool.query(
      `UPDATE conversations 
       SET handling_type = ?, agent_id = ?, department_id = ?, transfer_time = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        agentId ? 'agent' : 'transferred', 
        agentId || null, 
        departmentId || null, 
        conversationId
      ]
    );
    
    // Add system message about transfer
    await pool.query(
      'INSERT INTO messages (conversation_id, sender, content) VALUES (?, "system", ?)',
      [
        conversationId, 
        agentId 
          ? 'Conversation transferred to agent' 
          : 'Conversation queued for agent assistance'
      ]
    );
    
    // Get io instance from app
    const io = req.app.get('socketio');
    
    // If specific agent assigned, notify via WebSocket
    if (agentId && io) {
      io.to(`agent_${agentId}`).emit('conversation_assigned', {
        conversationId,
        botId: conversations[0].chatbot_id
      });
    } else if (io) {
      // Notify all online agents for this client
      io.to(`client_${req.user.id}`).emit('new_conversation', {
        conversationId,
        botId: conversations[0].chatbot_id
      });
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error transferring conversation:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept a conversation (for agents)
router.post('/:id/accept', async (req, res) => {
  try {
    // Get agent verification from request
    const { agentId } = req.body;
    
    if (!agentId) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }
    
    const conversationId = req.params.id;
    
    // Get agent details
    const [agents] = await pool.query(
      'SELECT * FROM agents WHERE id = ?',
      [agentId]
    );
    
    if (agents.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    const agent = agents[0];
    
    // Check if conversation exists and belongs to agent's client
    const [conversations] = await pool.query(
      `SELECT c.* FROM conversations c
       JOIN chatbots b ON c.chatbot_id = b.id
       WHERE c.id = ? AND b.client_id = ?`,
      [conversationId, agent.client_id]
    );
    
    if (conversations.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Update conversation
    await pool.query(
      `UPDATE conversations 
       SET handling_type = 'agent', agent_id = ?
       WHERE id = ?`,
      [agentId, conversationId]
    );
    
    // Add system message
    await pool.query(
      'INSERT INTO messages (conversation_id, sender, content, agent_id) VALUES (?, "system", ?, ?)',
      [
        conversationId, 
        `${agent.name} has joined the conversation`,
        agentId
      ]
    );
    
    // Get io instance from app
    const io = req.app.get('socketio');
    
    // Notify visitor via WebSocket
    if (io) {
      io.to(`conv_${conversationId}`).emit('agent_joined', {
        agentName: agent.name,
        agentId: agent.id
      });
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error accepting conversation:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// End a conversation (for agents)
router.post('/:id/end', async (req, res) => {
  try {
    const conversationId = req.params.id;
    const { agentId } = req.body;
    
    if (!agentId) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }
    
    // Check if conversation exists and is assigned to this agent
    const [conversations] = await pool.query(
      'SELECT * FROM conversations WHERE id = ? AND agent_id = ?',
      [conversationId, agentId]
    );
    
    if (conversations.length === 0) {
      return res.status(404).json({ error: 'Conversation not found or not assigned to you' });
    }
    
    // Get agent details
    const [agents] = await pool.query(
      'SELECT * FROM agents WHERE id = ?',
      [agentId]
    );
    
    if (agents.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    // Update conversation
    await pool.query(
      `UPDATE conversations 
       SET ended_at = CURRENT_TIMESTAMP, ended_by = 'agent'
       WHERE id = ?`,
      [conversationId]
    );
    
    // Add system message
    await pool.query(
      'INSERT INTO messages (conversation_id, sender, content, agent_id) VALUES (?, "system", ?, ?)',
      [
        conversationId, 
        'Conversation ended by agent',
        agentId
      ]
    );
    
    // Get io instance from app
    const io = req.app.get('socketio');
    
    // Notify visitor via WebSocket
    if (io) {
      io.to(`conv_${conversationId}`).emit('conversation_ended', {
        agentName: agents[0].name,
        agentId: agentId
      });
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error ending conversation:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get agent's conversations
router.get('/agent/:agentId', async (req, res) => {
  try {
    const agentId = req.params.agentId;
    
    // Verify agent exists
    const [agents] = await pool.query(
      'SELECT * FROM agents WHERE id = ?',
      [agentId]
    );
    
    if (agents.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    // Get active conversations assigned to this agent
    const [active] = await pool.query(
      `SELECT c.*, v.current_url, v.is_online,
        (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY timestamp DESC LIMIT 1) as lastMessage,
        (SELECT timestamp FROM messages WHERE conversation_id = c.id ORDER BY timestamp DESC LIMIT 1) as lastMessageTime
       FROM conversations c
       LEFT JOIN visitors v ON c.visitor_id = v.id
       WHERE c.agent_id = ? AND c.ended_at IS NULL
       ORDER BY lastMessageTime DESC`,
      [agentId]
    );
    
    // Get pending conversations for this agent's client
    const [pending] = await pool.query(
      `SELECT c.*, v.current_url, v.is_online,
        (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY timestamp DESC LIMIT 1) as lastMessage,
        (SELECT timestamp FROM messages WHERE conversation_id = c.id ORDER BY timestamp DESC LIMIT 1) as lastMessageTime
       FROM conversations c
       JOIN chatbots b ON c.chatbot_id = b.id
       LEFT JOIN visitors v ON c.visitor_id = v.id
       WHERE b.client_id = ? AND c.handling_type = 'transferred' AND c.agent_id IS NULL AND c.ended_at IS NULL
       ORDER BY c.transfer_time ASC`,
      [agents[0].client_id]
    );
    
    res.json({ active, pending });
  } catch (err) {
    console.error('Error fetching agent conversations:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all messages for a conversation
router.get('/:id/messages', async (req, res) => {
  try {
    const conversationId = req.params.id;
    
    // Get messages
    const [messages] = await pool.query(
      `SELECT m.*, a.name as agent_name
       FROM messages m
       LEFT JOIN agents a ON m.agent_id = a.id
       WHERE m.conversation_id = ?
       ORDER BY m.timestamp ASC`,
      [conversationId]
    );
    
    // Format messages
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      conversationId: msg.conversation_id,
      sender: msg.sender,
      content: msg.content,
      agentId: msg.agent_id,
      agentName: msg.agent_name,
      isRead: Boolean(msg.is_read),
      readAt: msg.read_at,
      timestamp: new Date(msg.timestamp)
    }));
    
    res.json(formattedMessages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update messages as read
router.put('/:id/messages/read', async (req, res) => {
  try {
    const conversationId = req.params.id;
    const { agentId } = req.body;
    
    if (!agentId) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }
    
    // Update messages to read
    await pool.query(
      `UPDATE messages 
       SET is_read = TRUE, read_at = CURRENT_TIMESTAMP 
       WHERE conversation_id = ? AND sender = 'user' AND is_read = FALSE`,
      [conversationId]
    );
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking messages as read:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;