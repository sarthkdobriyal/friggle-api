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

const toggleisActive = async (req, res) => {
    try{
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.isActive = !user.isActive;
        await user.save();
        res.status(200).json({ message: 'User active status updated successfully' });
    }catch(e) {
        console.error('Error toggling active status:', e);
        res.status(500).json({ error: 'Failed to toggle active status' });
    }
}
const toggleisAdmin = async (req, res) => {
    try{
        console.log('Toggling admin status for user:', req.body);
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.role = user.role === 'admin' ? 'user' : 'admin';
        await user.save();
        res.status(200).json({ message: 'User role updated successfully' });
    }catch(e) {
        console.error('Error toggling admin status:', e);
        res.status(500).json({ error: 'Failed to toggle admin status' });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.deleteOne();
        // Delete all videos by this user
        await Video.deleteMany({ userId });
        res.status(200).json({ message: 'User and their videos deleted successfully' });
    } catch (e) {
        console.error('Error deleting user:', e);
        res.status(500).json({ error: 'Failed to delete user' });
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
    getAllVideos,
    deleteUser,
    toggleisActive,
    toggleisAdmin

};