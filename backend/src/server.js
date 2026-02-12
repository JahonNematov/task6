import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRouter from './routes/users.js';
import gamesRouter from './routes/games.js';
import setupGameSocket from './socket/gameSocket.js';

dotenv.config();

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

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
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
});

export { io };
