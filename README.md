# 🎮 Tic-Tac-Toe Multiplayer Platform

A modern, real-time multiplayer Tic-Tac-Toe game built with React, Node.js, Socket.IO, and PostgreSQL.

## ✨ Features

- 🎯 **Real-time Gameplay** - Instant updates using Socket.IO
- 👥 **Multiplayer Support** - Multiple games running simultaneously
- 📊 **Player Statistics** - Track wins, losses, draws, and win rates
- 🏆 **Leaderboard** - Compete with other players
- 🎨 **Beautiful UI** - Modern, responsive design with animations
- 🚀 **Fast & Scalable** - Built with performance in mind
- 📱 **Mobile Friendly** - Works perfectly on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Socket.IO Client** - Real-time communication
- **React Hot Toast** - Beautiful notifications
- **CSS3** - Modern styling with animations

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.IO** - WebSocket server
- **PostgreSQL** - Database
- **pg** - PostgreSQL client

## 📁 Project Structure

```
task6/
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   ├── db.js
│   │   │   ├── init.js
│   │   │   └── schema.sql
│   │   ├── models/
│   │   │   ├── Game.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── games.js
│   │   │   └── users.js
│   │   ├── socket/
│   │   │   └── gameSocket.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── render.yaml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Game.jsx
│   │   │   ├── Game.css
│   │   │   ├── GameBoard.jsx
│   │   │   ├── GameBoard.css
│   │   │   ├── Lobby.jsx
│   │   │   ├── Lobby.css
│   │   │   ├── Login.jsx
│   │   │   ├── Login.css
│   │   │   ├── Stats.jsx
│   │   │   └── Stats.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── index.html
│   ├── netlify.toml
│   ├── package.json
│   └── vite.config.js
├── DEPLOYMENT.md
└── README.md
```

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Update `.env` with your PostgreSQL credentials:
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/tictactoe
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

5. Initialize database:
```bash
npm run db:init
```

6. Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Update `.env` if needed:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

5. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📦 Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

### Quick Deploy Summary:

**Backend (Render.com):**
1. Create PostgreSQL database
2. Create Web Service
3. Set environment variables
4. Deploy and initialize database

**Frontend (Netlify):**
1. Connect GitHub repository
2. Set build settings
3. Add environment variables
4. Deploy

## 🎮 How to Play

1. **Login:**
   - Enter your name (no password required)
   - Click "Start Playing"

2. **Create or Join Game:**
   - Create a new game and wait for opponent
   - OR join an existing game from the lobby

3. **Play:**
   - Take turns placing X or O
   - First to get 3 in a row wins!
   - Track your stats and compete on the leaderboard

## 📊 Features Breakdown

### User Management
- Simple name-based login
- Automatic user creation
- Statistics tracking
- Win rate calculation

### Game Management
- Create game sessions
- Join available games
- Real-time move synchronization
- Automatic winner detection
- Draw detection
- Game cancellation on disconnect

### UI/UX
- Smooth animations
- Responsive design
- Visual feedback
- Real-time notifications
- Player turn indicators
- Winning line highlighting

## 🔧 Development Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run db:init    # Initialize database schema
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🌐 API Endpoints

### Users
- `POST /api/users/login` - Create or login user
- `GET /api/users/stats/:name` - Get user statistics
- `GET /api/users/leaderboard` - Get top players

### Games
- `GET /api/games/active` - Get all active games
- `GET /api/games/waiting` - Get waiting games
- `GET /api/games/:id` - Get game by ID

### Socket.IO Events

#### Client → Server
- `user:join` - Join with username
- `game:create` - Create new game
- `game:join` - Join existing game
- `game:move` - Make a move
- `game:leave` - Leave game

#### Server → Client
- `game:created` - Game created successfully
- `game:started` - Game started (opponent joined)
- `game:updated` - Board updated
- `game:over` - Game finished
- `game:cancelled` - Game cancelled
- `games:updated` - Game list updated
- `error` - Error occurred

## 🎨 Design Features

- Dark theme with gradient backgrounds
- Smooth animations and transitions
- Hover effects and visual feedback
- Responsive grid layout
- Custom scrollbars
- Modern glass-morphism effects
- Accessible color contrasts

## 🔒 Security Considerations

- Input validation on both client and server
- SQL injection prevention using parameterized queries
- XSS protection
- CORS configuration
- Environment variable usage for sensitive data

## 🐛 Known Issues & Future Improvements

### Potential Improvements
- [ ] Add chat functionality
- [ ] Implement game history
- [ ] Add different board sizes (4x4, 5x5)
- [ ] Add AI opponent option
- [ ] Implement tournaments
- [ ] Add sound effects
- [ ] Add game timer
- [ ] Implement ELO rating system

## 📝 License

MIT License - Feel free to use this project for learning or portfolio purposes.

## 👨‍💻 Author

Created as part of Itransition Task #6

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- React team for the amazing framework
- Vite for blazing fast development experience
- Render and Netlify for free hosting

---

**Made with ❤️ for the Itransition internship program**