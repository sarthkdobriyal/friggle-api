const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  video_url: {
    type: String,
    required: [true, 'Video URL is required'],
    trim: true
  },
  prompt: {
    type: String,
    required: [true, 'Prompt is required'],
    trim: true,
    maxlength: [1000, 'Prompt cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});



const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
