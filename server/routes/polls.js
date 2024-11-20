const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');
const auth = require('../middleware/auth');
const { validatePollCreation } = require('../middleware/validation');

// Маршруты для голосований
router.post('/', auth, validatePollCreation, pollController.createPoll);
router.get('/', pollController.getActivePolls);
router.get('/:id', pollController.getPollById);
router.post('/:id/vote', auth, pollController.vote);
router.get('/:id/results', pollController.getPollResults);


module.exports = router; 