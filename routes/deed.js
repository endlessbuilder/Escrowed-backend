const express = require('express');
const { createDeed, getAllDeeds, getDeedById, updateDeed } = require('../controllers/deedController');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');

router.get('/', getAllDeeds);
router.post('/create', createDeed);
router.get('/:id', getDeedById);
router.patch('/:id/update', updateDeed);

module.exports = router;
