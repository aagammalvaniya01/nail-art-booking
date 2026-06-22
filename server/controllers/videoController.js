import Video from '../models/Video.js';

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({});
    return res.status(200).json({ success: true, videos });
  } catch (error) {
    console.error('Get videos error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching videos' });
  }
};

// @desc    Create a new video link (Super Admin / Admin only)
// @route   POST /api/videos
// @access  Private
export const createVideo = async (req, res) => {
  const { title, video, thumbnail } = req.body;

  try {
    if (!title || !video || !thumbnail) {
      return res.status(400).json({ success: false, message: 'Please provide title, video URL, and thumbnail URL' });
    }

    const videoItem = await Video.create({
      title,
      video,
      thumbnail
    });

    return res.status(201).json({
      success: true,
      message: 'Video added successfully!',
      video: videoItem
    });
  } catch (error) {
    console.error('Create video error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error creating video' });
  }
};

// @desc    Delete a video link (Super Admin only)
// @route   DELETE /api/videos/:id
// @access  Private
export const deleteVideo = async (req, res) => {
  try {
    const videoItem = await Video.findByIdAndDelete(req.params.id);
    if (!videoItem) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    return res.status(200).json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error deleting video' });
  }
};
