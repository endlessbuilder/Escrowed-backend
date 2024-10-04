const express = require('express');
const { createLog, getLogsByUserId, readUpdateLog } = require('../controllers/logController');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');

router.post('/create', createLog);
router.get('/:id', getLogsByUserId);
router.patch('/:log_id', readUpdateLog);

module.exports = router;
