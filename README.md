# BotUp - Chatbot Platform

BotUp is a platform that allows you to create and customize intelligent chatbots for your website. The system includes a dashboard for managing your chatbots and an embeddable widget that can be added to any website.

Copyright (c) 2024 Mohamed Bensbaa. All rights reserved.

## Features

- Create and customize intelligent chatbots
- Customize appearance, behavior, and responses
- Test chatbots in real-time
- Embed chatbots on any website with a simple script
- Track conversation statistics
- Real-time conversation management

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MySQL database
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/botup.git
   cd botup
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=botup
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

4. Initialize the database:
   ```
   node src/DB/init-db.js
   ```

### Running the Application

1. Start the backend server:
   ```
   npm start
   ```

2. In a separate terminal, start the frontend development server:
   ```
   npm run dev
   ```

3. Access the application at `http://localhost:3000`

## Project Structure

- `/src` - Source code
  - `/components` - React components
  - `/contexts` - React contexts for state management
  - `/pages` - Page components
  - `/services` - Service modules
  - `/DB` - Database and backend code
    - `/routes` - API routes
    - `db.js` - Database connection
    - `server.js` - Express server
  - `/public` - Public assets
    - `widget.js` - Embeddable chatbot widget

## API Endpoints

- `/api/auth` - Authentication
  - `POST /register` - Register a new user
  - `POST /login` - Login
  - `POST /refresh` - Refresh JWT token

- `/api/chatbots` - Chatbot management
  - `GET /` - Get all chatbots
  - `GET /:id` - Get a specific chatbot
  - `POST /` - Create a new chatbot
  - `PUT /:id` - Update a chatbot
  - `DELETE /:id` - Delete a chatbot
  - `GET /public/:id` - Get public chatbot config
  - `POST /:id/conversation` - Start a conversation
  - `POST /:id/message` - Send a message

- `/api/conversations` - Conversation management
  - `GET /chatbot/:id` - Get conversations for a chatbot
  - `GET /analytics/chatbot/:id` - Get analytics for a chatbot

- `/api/chatbot` - Chatbot service
  - `POST /generate` - Generate chatbot response

## Embedding on Your Website

Add this script to your website to embed the chatbot:

```html
<script src="http://your-server-url:5000/widget.js" data-botid="YOUR_BOT_ID"></script>
```

Replace `YOUR_BOT_ID` with the ID of your chatbot.

## Chatbot Responses

The application includes intelligent response generation that provides contextual and helpful replies to user queries. The system is designed to be easily extensible for integration with various AI models or custom response logic.

## License

Copyright (c) 2024 Mohamed Bensbaa. All rights reserved.

This project is proprietary software. Unauthorized copying, distribution, or modification is strictly prohibited.
