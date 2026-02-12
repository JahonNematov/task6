import { useState, useEffect } from 'react';
import './Stats.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Stats({ userName }) {
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchLeaderboard();
  }, [userName]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/stats/${userName}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/leaderboard?limit=5`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  if (loading) {
    return (
      <div className="stats-loading">
        <div className="spinner-large"></div>
        <p>Loading stats...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="stats-empty">
        <p>No stats available</p>
      </div>
    );
  }

  return (
    <div className="stats-container">
      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon">🏆</div>
          <div className="stat-value">{stats.wins}</div>
          <div className="stat-label">Wins</div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">❌</div>
          <div className="stat-value">{stats.losses}</div>
          <div className="stat-label">Losses</div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">🤝</div>
          <div className="stat-value">{stats.draws}</div>
          <div className="stat-label">Draws</div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">🎮</div>
          <div className="stat-value">{stats.gamesPlayed}</div>
          <div className="stat-label">Total Games</div>
        </div>

        <div className="stat-card card highlight">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{stats.winRate}%</div>
          <div className="stat-label">Win Rate</div>
        </div>
      </div>

      {leaderboard.length > 0 && (
        <div className="leaderboard card">
          <h3 className="leaderboard-title">🏆 Top Players</h3>
          <div className="leaderboard-list">
            {leaderboard.map((player, index) => (
              <div
                key={player.name}
                className={`leaderboard-item ${
                  player.name === userName ? 'current-user' : ''
                } ${index < 3 ? `rank-${index + 1}` : ''}`}
              >
                <div className="rank">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && `#${index + 1}`}
                </div>
                <div className="player-info">
                  <div className="player-name">{player.name}</div>
                  <div className="player-stats">
                    {player.wins}W • {player.losses}L • {player.draws}D
                  </div>
                </div>
                <div className="player-winrate">
                  {parseFloat(player.win_rate).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Stats;
