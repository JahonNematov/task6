import express from 'express';
import Game from '../models/Game.js';

const router = express.Router();

// Get all active games
router.get('/active', async (req, res) => {
  try {
    const games = await Game.getActiveGames();
    res.json(games);
  } catch (error) {
    console.error('Error fetching active games:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get waiting games
router.get('/waiting', async (req, res) => {
  try {
    const games = await Game.getWaitingGames();
    res.json(games);
  } catch (error) {
    console.error('Error fetching waiting games:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get game by ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
