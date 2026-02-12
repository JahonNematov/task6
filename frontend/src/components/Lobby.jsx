import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Stats from './Stats';
import './Lobby.css';

function Lobby({ socket, user, onGameStart, onLogout }) {
  const [waitingGames, setWaitingGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    // Fetch waiting games
    fetchWaitingGames();

    // Listen for game updates
    socket.on('games:updated', () => {
      fetchWaitingGames();
    });

    // Listen for game created
    socket.on('game:created', (game) => {
      toast.success('Game created! Waiting for opponent...');
      onGameStart(game);
    });

    // Listen for game started
    socket.on('game:started', (game) => {
      toast.success('Opponent joined! Game starting...');
      onGameStart(game);
    });

    // Listen for errors
    socket.on('error', (error) => {
      toast.error(error.message);
      setLoading(false);
    });

    return () => {
      socket.off('games:updated');
      socket.off('game:created');
      socket.off('game:started');
      socket.off('error');
    };
  }, [socket, onGameStart]);

  const fetchWaitingGames = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/games/waiting`);
      if (response.ok) {
        const games = await response.json();
        setWaitingGames(games);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const handleCreateGame = () => {
    setLoading(true);
    socket.emit('game:create', {
      userId: user.id,
      userName: user.name
    });
  };

  const handleJoinGame = (gameId) => {
    setLoading(true);
    socket.emit('game:join', {
      gameId,
      userId: user.id,
      userName: user.name
    });
  };

  return (
    <div className="lobby-container container">
      <div className="lobby-header">
        <div className="user-info">
          <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div>
            <h2 className="user-name">{user.name}</h2>
            <p className="user-subtitle">Ready to play</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowStats(!showStats)}
          >
            {showStats ? 'Hide Stats' : 'View Stats'}
          </button>
          <button className="btn btn-danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {showStats && (
        <div className="stats-section fade-in">
          <Stats userName={user.name} />
        </div>
      )}

      <div className="lobby-content">
        <div className="create-game-section card">
          <h2 className="section-title">Create New Game</h2>
          <p className="section-description">
            Start a new game and wait for an opponent to join
          </p>
          <button
            className="btn btn-primary btn-large"
            onClick={handleCreateGame}
            disabled={loading}
          >
            {loading ? 'Creating...' : '+ Create Game'}
          </button>
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="join-game-section card">
          <h2 className="section-title">Available Games</h2>
          <p className="section-description">
            Join an existing game and start playing
          </p>

          <div className="games-list">
            {waitingGames.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎮</div>
                <p className="empty-text">No games available</p>
                <p className="empty-hint">Create a new game to get started!</p>
              </div>
            ) : (
              waitingGames.map((game) => (
                <div key={game.id} className="game-item">
                  <div className="game-info">
                    <div className="game-host">
                      <div className="host-avatar">
                        {game.player1Name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="host-name">{game.player1Name}</p>
                        <p className="host-label">Host</p>
                      </div>
                    </div>
                    <div className="game-status">
                      <span className="badge badge-warning">Waiting</span>
                    </div>
                  </div>
                  <button
                    className="btn btn-success"
                    onClick={() => handleJoinGame(game.id)}
                    disabled={loading || game.player1Name === user.name}
                  >
                    {game.player1Name === user.name ? 'Your Game' : 'Join Game'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
