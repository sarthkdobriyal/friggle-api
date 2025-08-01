const api_config = require('../config');
const User = require('../models/userModel');


const generateAiVideo = async (req, res) => {
  const { prompt } = req.body;
  const { userId } = req.user;

  console.log('Generating AI video for user:', userId, 'with prompt:', prompt);

  if (!userId || !prompt) {
    return res.status(400).json({ error: 'User ID and prompt are required' });
  }

  try {
    // Simulate video generation
    const videoUrl = `https://example.com/videos/${userId}/${encodeURIComponent(prompt)}.mp4`;
    res.status(200).json({ videoUrl });
  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({ error: 'Failed to generate video' });
  }
}


module.exports = {
 generateAiVideo
};
