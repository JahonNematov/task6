import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import usersRouter from './routes/users.js';
import gamesRouter from './routes/games.js';
import setupGameSocket from './socket/gameSocket.js';
import pool from './database/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Socket.IO setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: '🎮 Tic-Tac-Toe Server is running!' });
});

app.use('/api/users', usersRouter);
app.use('/api/games', gamesRouter);

// Setup Socket.IO handlers
setupGameSocket(io);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Database initialization endpoint (for manual init if needed)
// Can be accessed via GET in browser: /api/init-db
app.get('/api/init-db', async (req, res) => {
  try {
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await pool.query(schema);

    res.json({
      success: true,
      message: '✅ Database initialized successfully! Tables created.',
      info: 'You can now use the application.'
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: '❌ Failed to initialize database. Check logs for details.'
    });
  }
});

// POST endpoint for manual init (alternative)
app.post('/api/init-db', async (req, res) => {
  try {
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await pool.query(schema);

    res.json({
      success: true,
      message: 'Database initialized successfully!'
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Auto-initialize database on startup (production only)
async function initializeDatabase() {
  try {
    console.log('🔄 Checking database tables...');

    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await pool.query(schema);

    console.log('✅ Database tables ready!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    console.log('⚠️  You can manually initialize at: POST /api/init-db');
  }
}

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, async () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🎮 Tic-Tac-Toe Server Started!          ║
║                                            ║
║   📡 Server: http://localhost:${PORT}        ║
║   🗄️  Database: PostgreSQL                 ║
║   ⚡ Socket.IO: Enabled                    ║
║                                            ║
║   Status: ✅ Ready for connections        ║
╚════════════════════════════════════════════╝
  `);

  // Auto-initialize database
  await initializeDatabase();
});

export { io };
