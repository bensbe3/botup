const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('BotUp Setup Script');
console.log('------------------------');

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('Creating .env file...');
  const envContent = `DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=botup
JWT_SECRET=4fc2721d4b3282b66f0ffb9d11fc750ede902d179c37d34fe27e44a90d687dca
PORT=5000
REACT_APP_API_URL=http://localhost:5000/api`;

  fs.writeFileSync('.env', envContent);
  console.log('✅ .env file created');
} else {
  console.log('✅ .env file already exists');
}

// Install dependencies
console.log('Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Initialize database
console.log('Initializing database...');
try {
  execSync('node src/DB/init-db.js', { stdio: 'inherit' });
  console.log('✅ Database initialized');
} catch (error) {
  console.error('❌ Error initializing database:', error.message);
  process.exit(1);
}

console.log('\n🎉 Setup complete! 🎉');
console.log('\nTo start the application, run:');
console.log('npm run dev:all');
console.log('\nOr separately:');
console.log('npm start     # Backend server');
console.log('npm run dev   # Frontend server'); 