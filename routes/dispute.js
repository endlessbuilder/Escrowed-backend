const express = require('express');
const { createDispute, updateDispute, getDisputeById } = require('../controllers/disputeController');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');

router.post('/create', createDispute);
router.get('/:id', getDisputeById);
router.patch('/:id/update', updateDispute);

module.exports = router;
