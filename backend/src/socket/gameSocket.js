import Game from '../models/Game.js';
import User from '../models/User.js';

// Store active connections
const players = new Map(); // socketId -> { userId, userName, gameId }

export default function setupGameSocket(io) {
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // User joins with their name
    socket.on('user:join', async ({ userName, userId }) => {
      players.set(socket.id, { userId, userName, gameId: null });
      console.log(`👤 User ${userName} joined`);
    });

    // Create a new game
    socket.on('game:create', async ({ userId, userName }) => {
      try {
        const game = await Game.create(userId, userName);

        // Update player's current game
        const player = players.get(socket.id);
        if (player) {
          player.gameId = game.id;
        }

        socket.join(game.id);
        socket.emit('game:created', game);

        // Broadcast to all users that a new game is available
        io.emit('games:updated');

        console.log(`🎮 Game created: ${game.id} by ${userName}`);
      } catch (error) {
        console.error('Error creating game:', error);
        socket.emit('error', { message: 'Failed to create game' });
      }
    });

    // Join an existing game
    socket.on('game:join', async ({ gameId, userId, userName }) => {
      try {
        const game = await Game.joinGame(gameId, userId, userName);

        if (!game) {
          socket.emit('error', { message: 'Game not available' });
          return;
        }

        // Update player's current game
        const player = players.get(socket.id);
        if (player) {
          player.gameId = game.id;
        }

        socket.join(gameId);

        // Notify both players
        io.to(gameId).emit('game:started', game);
        io.emit('games:updated');

        console.log(`🎮 ${userName} joined game: ${gameId}`);
      } catch (error) {
        console.error('Error joining game:', error);
        socket.emit('error', { message: 'Failed to join game' });
      }
    });

    // Make a move
    socket.on('game:move', async ({ gameId, position, player }) => {
      try {
        const game = await Game.findById(gameId);

        if (!game) {
          socket.emit('error', { message: 'Game not found' });
          return;
        }

        // Update board
        const newBoard = [...game.board];
        newBoard[position] = player;

        // Switch turn
        const nextTurn = player === 'X' ? 'O' : 'X';

        // Check for winner
        const winner = checkWinner(newBoard);
        const isDraw = !winner && newBoard.every(cell => cell !== '');

        await Game.updateBoard(gameId, newBoard, nextTurn);

        if (winner || isDraw) {
          // Game over
          const winnerName = winner
            ? (winner === 'X' ? game.player1Name : game.player2Name)
            : null;

          await Game.endGame(gameId, winnerName);

          // Update user stats
          if (winner) {
            const winnerId = winner === 'X' ? game.player1Id : game.player2Id;
            const loserId = winner === 'X' ? game.player2Id : game.player1Id;
            await User.updateStats(winnerId, 'win');
            await User.updateStats(loserId, 'loss');
          } else if (isDraw) {
            await User.updateStats(game.player1Id, 'draw');
            await User.updateStats(game.player2Id, 'draw');
          }

          io.to(gameId).emit('game:over', {
            board: newBoard,
            winner: winnerName,
            isDraw
          });

          io.emit('games:updated');
        } else {
          // Continue game
          io.to(gameId).emit('game:updated', {
            board: newBoard,
            currentTurn: nextTurn
          });
        }
      } catch (error) {
        console.error('Error making move:', error);
        socket.emit('error', { message: 'Failed to make move' });
      }
    });

    // Leave game
    socket.on('game:leave', async ({ gameId }) => {
      try {
        const game = await Game.findById(gameId);

        if (game && game.status !== 'finished') {
          await Game.deleteGame(gameId);
          io.to(gameId).emit('game:cancelled');
          io.emit('games:updated');
          console.log(`❌ Game ${gameId} cancelled`);
        }

        socket.leave(gameId);

        const player = players.get(socket.id);
        if (player) {
          player.gameId = null;
        }
      } catch (error) {
        console.error('Error leaving game:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      const player = players.get(socket.id);

      if (player && player.gameId) {
        try {
          const game = await Game.findById(player.gameId);

          if (game && game.status !== 'finished') {
            await Game.deleteGame(player.gameId);
            io.to(player.gameId).emit('game:cancelled');
            io.emit('games:updated');
            console.log(`❌ Game ${player.gameId} cancelled due to disconnect`);
          }
        } catch (error) {
          console.error('Error handling disconnect:', error);
        }
      }

      players.delete(socket.id);
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
}

// Helper function to check for winner
function checkWinner(board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}
