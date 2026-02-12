import pool from '../database/db.js';
import { v4 as uuidv4 } from 'uuid';

class Game {
  static async create(player1Id, player1Name) {
    const gameId = uuidv4();
    const result = await pool.query(
      `INSERT INTO games (id, player1_id, player1_name, status)
       VALUES ($1, $2, $3, 'waiting')
       RETURNING *`,
      [gameId, player1Id, player1Name]
    );
    return this.formatGame(result.rows[0]);
  }

  static async findById(gameId) {
    const result = await pool.query(
      'SELECT * FROM games WHERE id = $1',
      [gameId]
    );
    return result.rows[0] ? this.formatGame(result.rows[0]) : null;
  }

  static async getWaitingGames() {
    const result = await pool.query(
      `SELECT * FROM games
       WHERE status = 'waiting'
       ORDER BY created_at DESC`
    );
    return result.rows.map(game => this.formatGame(game));
  }

  static async getActiveGames() {
    const result = await pool.query(
      `SELECT * FROM games
       WHERE status IN ('waiting', 'playing')
       ORDER BY created_at DESC`
    );
    return result.rows.map(game => this.formatGame(game));
  }

  static async joinGame(gameId, player2Id, player2Name) {
    const result = await pool.query(
      `UPDATE games
       SET player2_id = $1, player2_name = $2, status = 'playing', updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND status = 'waiting'
       RETURNING *`,
      [player2Id, player2Name, gameId]
    );
    return result.rows[0] ? this.formatGame(result.rows[0]) : null;
  }

  static async updateBoard(gameId, board, currentTurn) {
    const result = await pool.query(
      `UPDATE games
       SET board = $1, current_turn = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [JSON.stringify(board), currentTurn, gameId]
    );
    return result.rows[0] ? this.formatGame(result.rows[0]) : null;
  }

  static async endGame(gameId, winner) {
    const result = await pool.query(
      `UPDATE games
       SET status = 'finished', winner = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [winner, gameId]
    );
    return result.rows[0] ? this.formatGame(result.rows[0]) : null;
  }

  static async deleteGame(gameId) {
    await pool.query('DELETE FROM games WHERE id = $1', [gameId]);
  }

  static formatGame(game) {
    if (!game) return null;
    return {
      id: game.id,
      player1Id: game.player1_id,
      player2Id: game.player2_id,
      player1Name: game.player1_name,
      player2Name: game.player2_name,
      status: game.status,
      board: JSON.parse(game.board),
      currentTurn: game.current_turn,
      winner: game.winner,
      createdAt: game.created_at,
      updatedAt: game.updated_at
    };
  }
}

export default Game;
