const express = require('express');
const { createDeed, getAllDeeds, getDeedById, updateDeed, requestFundsAfter, requestFundsBefore, releaseFundsAfter, releaseFundsBefore, getMilestonesByDeedId, updateMilestoneByMilestoneId } = require('../controllers/deedController');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');

router.get('/', getAllDeeds);
router.post('/create', createDeed);
router.get('/:id', getDeedById);
router.patch('/:id/update', updateDeed);
router.post('/requestFundsBefore', requestFundsBefore); 
router.post('/requestFundsAfter', requestFundsAfter);
router.post('/releaseFundsBefore', releaseFundsBefore);
router.post('/releaseFundsAfter', releaseFundsAfter);
router.get('/:deed_id/milestones', getMilestonesByDeedId);
router.patch('/milestones/update/:milestone_id', updateMilestoneByMilestoneId);

module.exports = router;
