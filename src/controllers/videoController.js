
const Video = require('../models/videoModel');
const { uploadVideoToS3 } = require('../services/uploadToS3Service');
const { generateVideoVeo } = require('../services/videoGenerationService'); // Assuming this

require('dotenv').config();






const generateAiVideo = async (req, res) => {
  const { prompt } = req.body;
  const { userId } = req.user;

  console.log('Generating AI video for user:', userId, 'with prompt:', prompt);

  if (!userId || !prompt) {
    return res.status(400).json({ error: 'User ID and prompt are required' });
  }

  try {
    const videoUrl = await generateVideoVeo(prompt);
    // const videoUrl = "https://generativelanguage.googleapis.com/v1beta/files/ls9uy6ygd314:download?alt=media&key=AIzaSyAXsq6EzN7fhY55FKfohHnrB-S3VIt4nt0"

    // Download video and upload to S3
    const s3VideoUrl = await uploadVideoToS3(videoUrl, userId);

    // // Save video data to database
    const video = new Video({
      userId,
      video_url: s3VideoUrl,
      prompt
    });
    await video.save();

    res.status(200).json({ videoUrl: s3VideoUrl, videoId: video._id });
  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({ error: 'Failed to generate video' });
  }
}

const getRecentVideos = async (req, res) => {
  const { userId } = req.user;
  console.log('Fetching recent videos for user:', userId);

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const videos = await Video.find({ userId }).sort({ createdAt: -1 }).limit(5);
    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching recent videos:', error);
    res.status(500).json({ error: 'Failed to fetch recent videos' });
  }
}


const getAllVideos = async (req, res) => {
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const videos = await Video.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching all videos:', error);
    res.status(500).json({ error: 'Failed to fetch all videos' });
  }
}







module.exports = {
  generateAiVideo,
  getRecentVideos,
  getAllVideos
};
