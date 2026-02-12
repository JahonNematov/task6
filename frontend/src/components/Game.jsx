import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import GameBoard from './GameBoard';
import './Game.css';

function Game({ socket, user, game, onBackToLobby }) {
  const [gameState, setGameState] = useState(game);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [mySymbol, setMySymbol] = useState(null);
  const [opponentName, setOpponentName] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [winningLine, setWinningLine] = useState(null);

  useEffect(() => {
    // Determine player symbol and opponent
    const symbol = game.player1Name === user.name ? 'X' : 'O';
    setMySymbol(symbol);
    setOpponentName(
      game.player1Name === user.name ? game.player2Name : game.player1Name
    );

    // Check if it's my turn
    setIsMyTurn(gameState.currentTurn === symbol);

    // Listen for game updates
    socket.on('game:updated', handleGameUpdate);
    socket.on('game:over', handleGameOver);
    socket.on('game:cancelled', handleGameCancelled);

    return () => {
      socket.off('game:updated');
      socket.off('game:over');
      socket.off('game:cancelled');
    };
  }, [socket, game, user, gameState.currentTurn]);

  const handleGameUpdate = ({ board, currentTurn }) => {
    setGameState((prev) => ({
      ...prev,
      board,
      currentTurn
    }));
    setIsMyTurn(currentTurn === mySymbol);
    toast.success("Opponent's move!");
  };

  const handleGameOver = ({ board, winner, isDraw }) => {
    setGameState((prev) => ({ ...prev, board }));
    setGameOver(true);
    setWinner(winner);
    setIsDraw(isDraw);

    if (isDraw) {
      toast('Game Over - Draw!', { icon: '🤝' });
    } else if (winner === user.name) {
      toast.success('You Won! 🎉');
    } else {
      toast.error('You Lost! 😢');
    }

    // Calculate winning line
    if (!isDraw) {
      const line = calculateWinningLine(board);
      setWinningLine(line);
    }
  };

  const handleGameCancelled = () => {
    toast.error('Game cancelled - opponent disconnected');
    setTimeout(() => {
      onBackToLobby();
    }, 2000);
  };

  const handleCellClick = (position) => {
    if (!isMyTurn || gameOver) return;

    socket.emit('game:move', {
      gameId: gameState.id,
      position,
      player: mySymbol
    });
  };

  const handleLeaveGame = () => {
    if (!gameOver) {
      socket.emit('game:leave', { gameId: gameState.id });
    }
    onBackToLobby();
  };

  const calculateWinningLine = (board) => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6] // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return pattern;
      }
    }
    return null;
  };

  return (
    <div className="game-container container">
      <div className="game-header">
        <button className="btn btn-danger" onClick={handleLeaveGame}>
          ← Leave Game
        </button>
        <h2 className="game-title">Tic-Tac-Toe</h2>
        <div className="game-id">ID: {gameState.id.slice(0, 8)}</div>
      </div>

      <div className="game-content card">
        <div className="players-info">
          <div
            className={`player-card ${
              gameState.currentTurn === 'X' && !gameOver ? 'active' : ''
            } ${gameOver && winner === game.player1Name ? 'winner' : ''}`}
          >
            <div className="player-avatar x-player">
              {game.player1Name.charAt(0).toUpperCase()}
            </div>
            <div className="player-details">
              <p className="player-name">{game.player1Name}</p>
              <p className="player-symbol">
                <span className="x-mark">X</span>
              </p>
            </div>
            {game.player1Name === user.name && (
              <span className="badge badge-info">You</span>
            )}
          </div>

          <div className="vs-divider">VS</div>

          <div
            className={`player-card ${
              gameState.currentTurn === 'O' && !gameOver ? 'active' : ''
            } ${gameOver && winner === game.player2Name ? 'winner' : ''}`}
          >
            <div className="player-avatar o-player">
              {game.player2Name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="player-details">
              <p className="player-name">
                {game.player2Name || 'Waiting...'}
              </p>
              <p className="player-symbol">
                <span className="o-mark">O</span>
              </p>
            </div>
            {game.player2Name === user.name && (
              <span className="badge badge-info">You</span>
            )}
          </div>
        </div>

        <div className="game-status">
          {gameOver ? (
            isDraw ? (
              <div className="status-message draw">
                <span className="status-icon">🤝</span>
                <span>Game Draw!</span>
              </div>
            ) : (
              <div
                className={`status-message ${
                  winner === user.name ? 'win' : 'lose'
                }`}
              >
                <span className="status-icon">
                  {winner === user.name ? '🎉' : '😢'}
                </span>
                <span>
                  {winner === user.name
                    ? 'You Won!'
                    : `${winner} Won!`}
                </span>
              </div>
            )
          ) : (
            <div className="status-message">
              <span className="status-icon">
                {isMyTurn ? '⏰' : '⏳'}
              </span>
              <span>
                {isMyTurn ? "Your Turn!" : `${opponentName}'s Turn`}
              </span>
            </div>
          )}
        </div>

        <GameBoard
          board={gameState.board}
          onCellClick={handleCellClick}
          disabled={!isMyTurn || gameOver}
          winningLine={winningLine}
        />

        {gameOver && (
          <div className="game-actions">
            <button
              className="btn btn-primary btn-large"
              onClick={onBackToLobby}
            >
              Back to Lobby
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;
