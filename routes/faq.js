const express = require('express');
const { getAllFAQs, createFAQ, updateFAQ, deleteFAQ } = require('../controllers/faqController');
const { authenticate } = require('../middlewares/auth'); // If you want to protect these routes

const router = express.Router();

router.get('/', getAllFAQs); // Get all FAQs
router.post('/', createFAQ); // Create a new FAQ
router.patch('/:faq_id', updateFAQ); // Update an existing FAQ
router.delete('/:faq_id', deleteFAQ); // Delete an FAQ

module.exports = router;