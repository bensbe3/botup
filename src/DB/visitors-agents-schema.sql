-- Visitors Table
CREATE TABLE IF NOT EXISTS visitors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bot_id INT NOT NULL,
  current_url VARCHAR(512),
  referrer VARCHAR(512),
  user_agent TEXT,
  screen_size VARCHAR(20),
  ip_address VARCHAR(45),
  timezone VARCHAR(100),
  language VARCHAR(20),
  first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_online BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (bot_id) REFERENCES chatbots(id) ON DELETE CASCADE
);

-- Agents Table
CREATE TABLE IF NOT EXISTS agents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  role ENUM('admin', 'agent') DEFAULT 'agent',
  status ENUM('online', 'away', 'offline') DEFAULT 'offline',
  last_active TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Departments Table (optional)
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Agent Department Relation (optional)
CREATE TABLE IF NOT EXISTS agent_departments (
  agent_id INT NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (agent_id, department_id),
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Modify Conversations Table - Add columns only if they don't exist
-- Check if visitor_id column exists
SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'conversations' AND column_name = 'visitor_id';
SET @query = IF(@exists = 0, 'ALTER TABLE conversations ADD COLUMN visitor_id INT NULL', 'SELECT "visitor_id already exists"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if handling_type column exists
SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'conversations' AND column_name = 'handling_type';
SET @query = IF(@exists = 0, 'ALTER TABLE conversations ADD COLUMN handling_type ENUM("ai", "agent", "transferred") DEFAULT "ai"', 'SELECT "handling_type already exists"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if agent_id column exists
SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'conversations' AND column_name = 'agent_id';
SET @query = IF(@exists = 0, 'ALTER TABLE conversations ADD COLUMN agent_id INT NULL', 'SELECT "agent_id already exists"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if department_id column exists
SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'conversations' AND column_name = 'department_id';
SET @query = IF(@exists = 0, 'ALTER TABLE conversations ADD COLUMN department_id INT NULL', 'SELECT "department_id already exists"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if transfer_time column exists
SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'conversations' AND column_name = 'transfer_time';
SET @query = IF(@exists = 0, 'ALTER TABLE conversations ADD COLUMN transfer_time TIMESTAMP NULL', 'SELECT "transfer_time already exists"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if ended_at column exists
SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'conversations' AND column_name = 'ended_at';
SET @query = IF(@exists = 0, 'ALTER TABLE conversations ADD COLUMN ended_at TIMESTAMP NULL', 'SELECT "ended_at already exists"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if ended_by column exists
SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'conversations' AND column_name = 'ended_by';
SET @query = IF(@exists = 0, 'ALTER TABLE conversations ADD COLUMN ended_by ENUM("visitor", "agent", "timeout", "system") NULL', 'SELECT "ended_by already exists"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if visitor_name column exists
SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'conversations' AND column_name = 'visitor_name';
SET @query = IF(@exists = 0, 'ALTER TABLE conversations ADD COLUMN visitor_name VARCHAR(255) NULL', 'SELECT "visitor_name already exists"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if visitor_email column exists
SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'conversations' AND column_name = 'visitor_email';
SET @query = IF(@exists = 0, 'ALTER TABLE conversations ADD COLUMN visitor_email VARCHAR(255) NULL', 'SELECT "visitor_email already exists"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if visitor_phone column exists
SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'conversations' AND column_name = 'visitor_phone';
SET @query = IF(@exists = 0, 'ALTER TABLE conversations ADD COLUMN visitor_phone VARCHAR(20) NULL', 'SELECT "visitor_phone already exists"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if rating column exists
SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'conversations' AND column_name = 'rating';
SET @query = IF(@exists = 0, 'ALTER TABLE conversations ADD COLUMN rating INT NULL', 'SELECT "rating already exists"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if feedback column exists
SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'conversations' AND column_name = 'feedback';
SET @query = IF(@exists = 0, 'ALTER TABLE conversations ADD COLUMN feedback TEXT NULL', 'SELECT "feedback already exists"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if tags column exists
SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'conversations' AND column_name = 'tags';
SET @query = IF(@exists = 0, 'ALTER TABLE conversations ADD COLUMN tags VARCHAR(255) NULL', 'SELECT "tags already exists"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign keys to conversations table if needed
SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'conversations' 
AND COLUMN_NAME = 'visitor_id' AND REFERENCED_TABLE_NAME = 'visitors';
SET @query = IF(@exists = 0, 'ALTER TABLE conversations ADD FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE SET NULL', 'SELECT "visitor_id foreign key already exists"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'conversations' 
AND COLUMN_NAME = 'agent_id' AND REFERENCED_TABLE_NAME = 'agents';
SET @query = IF(@exists = 0, 'ALTER TABLE conversations ADD FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL', 'SELECT "agent_id foreign key already exists"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'conversations' 
AND COLUMN_NAME = 'department_id' AND REFERENCED_TABLE_NAME = 'departments';
SET @query = IF(@exists = 0, 'ALTER TABLE conversations ADD FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL', 'SELECT "department_id foreign key already exists"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Modify Messages Table
-- Check if agent_id column exists
SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'messages' AND column_name = 'agent_id';
SET @query = IF(@exists = 0, 'ALTER TABLE messages ADD COLUMN agent_id INT NULL', 'SELECT "agent_id already exists in messages"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if is_read column exists
SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'messages' AND column_name = 'is_read';
SET @query = IF(@exists = 0, 'ALTER TABLE messages ADD COLUMN is_read BOOLEAN DEFAULT FALSE', 'SELECT "is_read already exists"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if read_at column exists
SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'messages' AND column_name = 'read_at';
SET @query = IF(@exists = 0, 'ALTER TABLE messages ADD COLUMN read_at TIMESTAMP NULL', 'SELECT "read_at already exists"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Modify sender column if needed
SET @column_type = '';
SELECT COLUMN_TYPE INTO @column_type FROM information_schema.columns 
WHERE table_schema = DATABASE() AND table_name = 'messages' AND column_name = 'sender';

SET @modify_sender = IF(@column_type != "enum('user','bot','agent','system')", 
  'ALTER TABLE messages MODIFY COLUMN sender ENUM("user", "bot", "agent", "system") NOT NULL', 
  'SELECT "sender column already has correct type"');
PREPARE stmt FROM @modify_sender;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add agent_id foreign key if needed
SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'messages' 
AND COLUMN_NAME = 'agent_id' AND REFERENCED_TABLE_NAME = 'agents';
SET @query = IF(@exists = 0, 'ALTER TABLE messages ADD FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL', 'SELECT "agent_id foreign key already exists in messages"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Canned Responses Table (optional)
CREATE TABLE IF NOT EXISTS canned_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  agent_id INT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  shortcut VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL
); 