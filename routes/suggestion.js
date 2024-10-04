const express = require('express');
const { getAllSuggestions, submitSuggestion, updateSuggestion, deleteSuggestion } = require('../controllers/suggestionController');
const { authenticate } = require('../middlewares/auth'); 

const router = express.Router();

router.get('/', getAllSuggestions); // Get all suggestions
router.post('/', submitSuggestion); // Submit a new suggestion
router.patch('/:suggestion_id', updateSuggestion); // Update an existing suggestion
router.delete('/:suggestion_id', deleteSuggestion); // Delete a suggestion

module.exports = router;