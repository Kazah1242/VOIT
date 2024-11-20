const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const voteController = require('../controllers/vote.controller');

// Публичные роуты
router.get('/', voteController.getActiveVotes);
router.get('/:id', voteController.getVoteById);
router.get('/:id/results', voteController.getVoteResults);

// Защищенные роуты
router.post('/', authMiddleware, voteController.createVote);
router.post('/submit', authMiddleware, voteController.submitVote);

module.exports = router; 