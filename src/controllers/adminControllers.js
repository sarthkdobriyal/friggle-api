const Video = require('../models/videoModel');
const User = require('../models/userModel');

const allusers = (req, res) => {
    try {
        console.log('Fetching all users', req.user);

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
        const stats = [
            { title: 'Total Users', value: totalUsers },
            { title: 'Total Videos', value: totalVideos },
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

module.exports = {
    allusers,
    getStats
};