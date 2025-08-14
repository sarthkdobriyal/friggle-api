const Video = require('../models/videoModel');
const User = require('../models/userModel');

const allusers = async (req, res) => {
    try {
        // Fetch all users without password field
        const users = await User.find().select('-password');
        
        console.log('Fetching all users:', users.length);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ error: 'Failed to fetch all users' });
    }
}


const getStats = async (req, res) => {
    try {
        // Example stats data
        const totalUsers = await User.find().countDocuments();
        const totalVideos = await Video.countDocuments();
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        const stats = [
            { title: 'Total Users', value: totalUsers },
            { title: 'Total Videos', value: totalVideos },
            { title: 'Total Admins', value: totalAdmins },
        ]

        console.log('Fetching stats:', stats);
        res.status(200).json(
            stats
        );
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}


const getAllVideos = async (req, res) => {
    try {
        // Populate userId with email
        const videos = await Video.find().populate('userId', 'email');
        console.log('Fetching all videos:', videos.length);
        res.status(200).json(videos);
    } catch (e) {
        console.error('Error fetching all videos:', e);
        res.status(500).json({ error: 'Failed to fetch all videos' });
    }
} 

module.exports = {
    allusers,
    getStats,
    getAllVideos
};