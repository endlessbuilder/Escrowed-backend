const express = require('express');
const { register, login, getUserProfile, updateUserDetail, getUserActivity } = require('../controllers/userController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/:id', getUserProfile); // Get user profile
router.patch('/:id', updateUserDetail); // Update user details
router.get('/activity/:userId', getUserActivity); 

module.exports = router;
