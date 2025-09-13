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

-- Modify Conversations Table
ALTER TABLE conversations 
  ADD COLUMN IF NOT EXISTS visitor_id INT NULL,
  ADD COLUMN IF NOT EXISTS handling_type ENUM('ai', 'agent', 'transferred') DEFAULT 'ai',
  ADD COLUMN IF NOT EXISTS agent_id INT NULL,
  ADD COLUMN IF NOT EXISTS department_id INT NULL,
  ADD COLUMN IF NOT EXISTS transfer_time TIMESTAMP NULL,
  ADD COLUMN IF NOT EXISTS ended_at TIMESTAMP NULL,
  ADD COLUMN IF NOT EXISTS ended_by ENUM('visitor', 'agent', 'timeout', 'system') NULL,
  ADD COLUMN IF NOT EXISTS visitor_name VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS visitor_email VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS visitor_phone VARCHAR(20) NULL,
  ADD COLUMN IF NOT EXISTS rating INT NULL,
  ADD COLUMN IF NOT EXISTS feedback TEXT NULL,
  ADD COLUMN IF NOT EXISTS tags VARCHAR(255) NULL;

-- Try to add foreign keys (will fail silently if already exist)
ALTER TABLE conversations 
  ADD FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE SET NULL,
  ADD FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL,
  ADD FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;
  
-- Modify Messages Table (skip is_read if it exists)
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS agent_id INT NULL,
  -- is_read column will be skipped if already exists
  ADD COLUMN IF NOT EXISTS read_at TIMESTAMP NULL;

-- Try to modify sender column (will show warning but continue if fails)
ALTER TABLE messages 
  MODIFY COLUMN sender ENUM('user', 'bot', 'agent', 'system') NOT NULL;

-- Try to add foreign key (will fail silently if already exists)
ALTER TABLE messages
  ADD FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL;

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