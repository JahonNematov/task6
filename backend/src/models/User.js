import pool from '../database/db.js';

class User {
  static async findByName(name) {
    const result = await pool.query(
      'SELECT * FROM users WHERE name = $1',
      [name]
    );
    return result.rows[0];
  }

  static async create(name) {
    const result = await pool.query(
      'INSERT INTO users (name) VALUES ($1) RETURNING *',
      [name]
    );
    return result.rows[0];
  }

  static async findOrCreate(name) {
    let user = await this.findByName(name);
    if (!user) {
      user = await this.create(name);
    } else {
      // Update last active
      await pool.query(
        'UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );
    }
    return user;
  }

  static async updateStats(userId, result) {
    let updateField;
    switch (result) {
      case 'win':
        updateField = 'wins = wins + 1';
        break;
      case 'loss':
        updateField = 'losses = losses + 1';
        break;
      case 'draw':
        updateField = 'draws = draws + 1';
        break;
      default:
        return;
    }

    await pool.query(
      `UPDATE users SET ${updateField}, games_played = games_played + 1 WHERE id = $1`,
      [userId]
    );
  }

  static async getStats(name) {
    const user = await this.findByName(name);
    if (!user) {
      return null;
    }
    return {
      name: user.name,
      wins: user.wins,
      losses: user.losses,
      draws: user.draws,
      gamesPlayed: user.games_played,
      winRate: user.games_played > 0
        ? ((user.wins / user.games_played) * 100).toFixed(1)
        : 0
    };
  }

  static async getLeaderboard(limit = 10) {
    const result = await pool.query(
      `SELECT name, wins, losses, draws, games_played,
       CASE WHEN games_played > 0 THEN (wins::float / games_played * 100) ELSE 0 END as win_rate
       FROM users
       WHERE games_played > 0
       ORDER BY wins DESC, win_rate DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }
}

export default User;
