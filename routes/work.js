const express = require('express');
const { submitWork, reviewWork } = require('../controllers/workController');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');

router.post('/submit', submitWork);
router.patch('/review/:deed_id', reviewWork);

module.exports = router;
