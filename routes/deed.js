const express = require('express');
const { createDeed, getAllDeeds, getDeedById, updateDeed, requestFunds, releaseFunds, getMilestonesByDeedId, updateMilestoneByMilestoneId } = require('../controllers/deedController');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');

router.get('/', getAllDeeds);
router.post('/create', createDeed);
router.get('/:id', getDeedById);
router.patch('/:id/update', updateDeed);
router.post('/requestFunds', requestFunds); 
router.post('/releaseFunds', releaseFunds);
router.get('/:deed_id/milestones', getMilestonesByDeedId);
router.patch('/milestones/update/:milestone_id', updateMilestoneByMilestoneId);

module.exports = router;
