import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Lobby from './components/Lobby';
import Game from './components/Game';
import './App.css';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

function App() {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);
  const [view, setView] = useState('login'); // login, lobby, game

  useEffect(() => {
    // Connect to socket server
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to server');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setView('lobby');

    if (socket) {
      socket.emit('user:join', {
        userName: userData.name,
        userId: userData.id
      });
    }
  };

  const handleGameStart = (game) => {
    setCurrentGame(game);
    setView('game');
  };

  const handleBackToLobby = () => {
    setCurrentGame(null);
    setView('lobby');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentGame(null);
    setView('login');
    if (socket) {
      socket.disconnect();
      socket.connect();
    }
  };

  return (
    <div className="app">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#f1f5f9',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f1f5f9',
            },
          },
        }}
      />

      {view === 'login' && (
        <Login onLogin={handleLogin} />
      )}

      {view === 'lobby' && socket && user && (
        <Lobby
          socket={socket}
          user={user}
          onGameStart={handleGameStart}
          onLogout={handleLogout}
        />
      )}

      {view === 'game' && socket && user && currentGame && (
        <Game
          socket={socket}
          user={user}
          game={currentGame}
          onBackToLobby={handleBackToLobby}
        />
      )}
    </div>
  );
}

export default App;
