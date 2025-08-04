const express = require('express');
const { generateAiVideo, getRecentVideos, getAllVideos } = require('../controllers/videoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/generate', authMiddleware, generateAiVideo);
router.get('/recent', authMiddleware, getRecentVideos);
router.get('/all', authMiddleware, getAllVideos);


module.exports = router;
