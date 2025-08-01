const express = require('express');
const { generateAiVideo } = require('../controllers/videoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/generate', authMiddleware, generateAiVideo);


module.exports = router;
