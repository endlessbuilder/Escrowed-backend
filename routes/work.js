const express = require('express');
const { submitWork, reviewWork } = require('../controllers/workController');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const upload = require('../middlewares/multer'); 

router.post('/submit', upload.single('file'), submitWork);
router.patch('/review/:deed_id', reviewWork);

module.exports = router;
