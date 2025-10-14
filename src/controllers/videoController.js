const Video = require('../models/videoModel');
const { uploadVideoToS3 } = require('../services/uploadToS3Service');
const { 
  // generateVideoVeo, 
  // generateVideoBytez, 
  enhancePrompt: enhancePromptService,  
  // generateVideoReplicate, 
  // generateVideoLeonardoAI,
  //  generateVideoBytedance 
  } = require('../services/videoGenerationService');

require('dotenv').config();






const generateAiVideo = async (req, res) => {
  const { prompt, model } = req.body;
  const { userId } = req.user;

  console.log('Generating AI video for user:', userId, 'with prompt:', prompt, model);

  if (!userId || !prompt) {
    return res.status(400).json({ error: 'User ID and prompt are required' });
  }

  try {
    // let videoUrl;
    // let needsS3Upload = true; // Flag to determine if we need to upload to S3

    // if(model === "gemini_veo_3") {
    //   console.log("Generating video with Gemini Veo 3 model");
    //   videoUrl = await generateVideoVeo(prompt);
    // } else if(model === "bytez_1.7b") {
    //   console.log("Generating video with Bytez 1.7B model");
    //   videoUrl = await generateVideoBytez(prompt);
    // } else if(model === "leonardoai/motion-2.0") {
    //   console.log("Generating video with Leonardo AI Motion 2.0 model");
    //   videoUrl = await generateVideoLeonardoAI(prompt, userId);
    //   needsS3Upload = false; // Already uploaded to S3
    // } 
    // else if(model === "bytedance/seedance-1-pro") {
    //   console.log("Generating video with Bytedance Seedance 1 Pro model");
    //   videoUrl = await generateVideoBytedance(prompt);
    // } else if(model === "tencent/hunyuan-video" || model === "black-forest-labs/flux-kontext-pro" || model === "bytedance/seedance-1-pro") {
    //   console.log("Generating video with Replicate model");
    //   videoUrl = await generateVideoReplicate(prompt, model);
    // } else {
    //   return res.status(400).json({ error: 'Invalid model selected' });
    // }

    // let s3VideoUrl;
    
    // if (needsS3Upload) {
    //   // Download video and upload to S3
    //   s3VideoUrl = await uploadVideoToS3(videoUrl, userId);
    // } else {
    //   // Video already uploaded to S3
    //   s3VideoUrl = videoUrl;
    // }

    // // Save video data to database
    // const video = new Video({
    //   userId,
    //   video_url: s3VideoUrl,
    //   prompt
    // });
    // await video.save();

    res.status(200).json({ videoUrl: s3VideoUrl, videoId: video._id });
  } catch (error) {
    console.error('Error generating video:', error.message);
    res.status(500).json({ error: error.message || 'Failed to generate video' });
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

const enhancePrompt = async (req, res) => {
  const { userInput } = req.body;


  if (!userInput) {
    return res.status(400).json({ error: 'User input is required' });
  }

  try {
    const modelResponse = await enhancePromptService(userInput);
    const enhancedPrompt = modelResponse.parts[0].text; // Clean up the response
    res.status(200).json({ enhancedPrompt });
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    res.status(500).json({ error: 'Failed to enhance prompt' });
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

const getExampleVideos = async (req, res) => {
  try {
    // const videos = await Video.find().sort({ createdAt: -1 }).limit(3);
    res.status(200).json({ message: 'Example videos endpoint - to be implemented' });
  } catch (error) {
    console.error('Error fetching recent videos:', error);
    res.status(500).json({ error: 'Failed to fetch recent videos' });
  }
}







module.exports = {
  generateAiVideo,
  getRecentVideos,
  getAllVideos,
  enhancePrompt,
  getExampleVideos
};
