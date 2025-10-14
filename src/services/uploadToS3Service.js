// Function to upload video to S3
const api_config = require('../config');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fetch = require('node-fetch');
require('dotenv').config();

// Configure AWS S3 v3
const s3Client = new S3Client({
  credentials: {
    accessKeyId: api_config.AWS_ACCESS_KEY_ID,
    secretAccessKey: api_config.AWS_SECRET_ACCESS_KEY,
  },
  region: 'ap-south-1' 
});

const uploadBufferToS3 = async (buffer, fileName, contentType) => {
    const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `videos/${fileName}`,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read'
    };

    try {
        console.log('Uploading buffer to S3...');
        const result = await s3Client.send(new PutObjectCommand(uploadParams));
        console.log('Buffer uploaded to S3:', result.Location);
        return result.Location;
    } catch (error) {
        console.error('Error uploading buffer to S3:', error);
        throw new Error('Failed to upload buffer to S3');
    }
};

async function uploadVideoToS3(videoUrl, userId) {
  try {
    // Download the video
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }
    
    const videoBytes = await response.buffer();
    
    // Generate unique filename
    const fileName = `videos/${userId}/${Date.now()}_video.mp4`;
    
    // Upload to S3 using v3 SDK
    const uploadCommand = new PutObjectCommand({
      Bucket: api_config.S3_BUCKET,
      Key: fileName,
      Body: videoBytes,
      ContentType: 'video/mp4'
    });
    
    await s3Client.send(uploadCommand);

    const s3Url = `https://${api_config.S3_BUCKET_URL}/${fileName}`;
    console.log('Video uploaded to S3:', s3Url);
    
    return s3Url;
  } catch (error) {
    console.error('Error uploading video to S3:', error);
    throw error;
  }
}

module.exports = {
  uploadVideoToS3,
  uploadBufferToS3
};