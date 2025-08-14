const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const { allusers, getStats, getAllVideos } = require('../controllers/adminControllers');

const router = express.Router();


router.get('/allUsers', adminMiddleware, allusers);
router.get('/allVideos', adminMiddleware, getAllVideos);
router.get('/stats', adminMiddleware, getStats);



module.exports = router;
