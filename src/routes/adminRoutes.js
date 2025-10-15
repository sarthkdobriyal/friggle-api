const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const { allusers, getStats, getAllVideos, deleteUser,toggleisActive,toggleisAdmin, addCreditsToUser } = require('../controllers/adminControllers');

const router = express.Router();


router.get('/allUsers', adminMiddleware, allusers);
router.get('/allVideos', adminMiddleware, getAllVideos);
router.delete('/user', adminMiddleware, deleteUser);
router.patch('/user/toggleActive', adminMiddleware, toggleisActive);
router.patch('/user/toggleAdmin', adminMiddleware, toggleisAdmin);
router.get('/stats', adminMiddleware, getStats);
router.post('/user/addCredits', adminMiddleware, addCreditsToUser);



module.exports = router;
