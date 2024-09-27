const express = require('express');
const { createLog, getLogsByUserId } = require('../controllers/logController');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');

router.post('/create', createLog);
router.get('/:id', getLogsByUserId);

module.exports = router;
