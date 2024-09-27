const express = require('express');
const { updateMilestone } = require('../controllers/milestoneController');
const router = express.Router();

router.patch('/:id/update', updateMilestone);

module.exports = router;
