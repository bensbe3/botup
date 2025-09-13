-- BotUp Database Initialization Script

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS botup;

-- Use the database
USE botup;

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create chatbots table
CREATE TABLE IF NOT EXISTS chatbots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  prompt TEXT,
  welcome_message TEXT,
  primary_color VARCHAR(50) DEFAULT '#4f46e5',
  icon_style VARCHAR(50) DEFAULT 'chat',
  position VARCHAR(50) DEFAULT 'right',
  show_on_mobile BOOLEAN DEFAULT TRUE,
  show_on_desktop BOOLEAN DEFAULT TRUE,
  collect_user_data BOOLEAN DEFAULT TRUE,
  show_branding BOOLEAN DEFAULT TRUE,
  auto_reply BOOLEAN DEFAULT FALSE,
  auto_open_delay INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chatbot_id INT NOT NULL,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  message_count INT DEFAULT 0,
  is_test BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (chatbot_id) REFERENCES chatbots(id) ON DELETE CASCADE
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  sender ENUM('user', 'bot') NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- Create a default client if none exists
INSERT INTO clients (name, email, plan)
SELECT 'Default Client', 'default@botup.app', 'free'
WHERE NOT EXISTS (SELECT * FROM clients LIMIT 1);

-- Create a default chatbot if none exists
INSERT INTO chatbots (client_id, name, prompt, welcome_message, primary_color)
SELECT 
  (SELECT id FROM clients LIMIT 1),
  'Demo Assistant',
  'You are a friendly assistant for my website. Answer customer questions helpfully and concisely.',
  'Hello! How can I help you today?',
  '#4f46e5'
WHERE NOT EXISTS (SELECT * FROM chatbots LIMIT 1);

-- Output success message
SELECT 'Database initialization complete!' AS message; 