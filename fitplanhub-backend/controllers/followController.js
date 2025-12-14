const Follow = require('../models/Follow');
const User = require('../models/User');
const FitnessPlan = require('../models/FitnessPlan');

// @desc    Follow a trainer
// @route   POST /api/follows/:trainerId
// @access  Private/User
exports.followTrainer = async (req, res) => {
  try {
    const trainerId = req.params.trainerId;

    // Check if trainer exists and is actually a trainer
    const trainer = await User.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found'
      });
    }

    if (trainer.role !== 'trainer') {
      return res.status(400).json({
        success: false,
        message: 'User is not a trainer'
      });
    }

    // Check if user is trying to follow themselves
    if (req.user.id === trainerId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: req.user.id,
      trainer: trainerId
    });

    if (existingFollow) {
      return res.status(400).json({
        success: false,
        message: 'You are already following this trainer'
      });
    }

    // Create follow relationship
    const follow = await Follow.create({
      follower: req.user.id,
      trainer: trainerId
    });

    await follow.populate('trainer', 'name email');

    res.status(201).json({
      success: true,
      message: 'Successfully followed trainer',
      data: follow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Unfollow a trainer
// @route   DELETE /api/follows/:trainerId
// @access  Private/User
exports.unfollowTrainer = async (req, res) => {
  try {
    const trainerId = req.params.trainerId;

    const follow = await Follow.findOneAndDelete({
      follower: req.user.id,
      trainer: trainerId
    });

    if (!follow) {
      return res.status(404).json({
        success: false,
        message: 'You are not following this trainer'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully unfollowed trainer',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get list of trainers user is following
// @route   GET /api/follows
// @access  Private/User
exports.getMyFollows = async (req, res) => {
  try {
    const follows = await Follow.find({ follower: req.user.id })
      .populate('trainer', 'name email')
      .sort('-createdAt');

    const trainers = follows.map(follow => follow.trainer);

    res.status(200).json({
      success: true,
      count: trainers.length,
      data: trainers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check if user is following a trainer
// @route   GET /api/follows/check/:trainerId
// @access  Private
exports.checkFollow = async (req, res) => {
  try {
    const follow = await Follow.findOne({
      follower: req.user.id,
      trainer: req.params.trainerId
    });

    res.status(200).json({
      success: true,
      data: {
        isFollowing: !!follow
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get personalized feed (plans from followed trainers)
// @route   GET /api/follows/feed
// @access  Private/User
exports.getFeed = async (req, res) => {
  try {
    // Get trainers the user follows
    const follows = await Follow.find({ follower: req.user.id }).select('trainer');
    const trainerIds = follows.map(follow => follow.trainer);

    // Get plans from these trainers
    const plans = await FitnessPlan.find({ trainer: { $in: trainerIds } })
      .populate('trainer', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};