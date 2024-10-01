const express = require('express');
const { updateMilestone, getMilestones } = require('../controllers/milestoneController');
const router = express.Router();

router.patch('/:id/update', updateMilestone);
router.get('/:deed_id', getMilestones);

module.exports = router;
