const express = require('express');
const { generateAiVideo, getRecentVideos, getAllVideos, enhancePrompt } = require('../controllers/videoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/generate', authMiddleware, generateAiVideo);
router.post('/enhancePrompt', authMiddleware, enhancePrompt);
router.get('/recent', authMiddleware, getRecentVideos);
router.get('/all', authMiddleware, getAllVideos);


module.exports = router;
