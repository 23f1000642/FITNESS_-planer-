const FitnessPlan = require('../models/FitnessPlan');
const Subscription = require('../models/Subscription');

// @desc    Create a new fitness plan
// @route   POST /api/plans
// @access  Private/Trainer
exports.createPlan = async (req, res) => {
  try {
    const { title, description, price, duration } = req.body;

    if (!title || !description || price === undefined || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const plan = await FitnessPlan.create({
      title,
      description,
      price,
      duration,
      trainer: req.user.id
    });

    await plan.populate('trainer', 'name email');

    res.status(201).json({
      success: true,
      message: 'Fitness plan created successfully',
      data: plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all fitness plans
// @route   GET /api/plans
// @access  Public
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await FitnessPlan.find().populate('trainer', 'name email');

    let userSubscriptions = [];
    if (req.user) {
      const subs = await Subscription.find({ 
        user: req.user.id,
        status: 'active'
      }).select('plan');
      userSubscriptions = subs.map(sub => sub.plan.toString());
    }

    const formattedPlans = plans.map(plan => {
      const hasAccess = req.user && userSubscriptions.includes(plan._id.toString());
      
      if (hasAccess) {
        return {
          _id: plan._id,           // ✅ CHANGED: from 'id' to '_id'
          title: plan.title,
          description: plan.description,
          price: plan.price,
          duration: plan.duration,
          trainer: plan.trainer,
          hasAccess: true,
          createdAt: plan.createdAt
        };
      } else {
        return {
          _id: plan._id,           // ✅ CHANGED: from 'id' to '_id'
          title: plan.title,
          price: plan.price,
          trainer: {
            _id: plan.trainer._id,
            name: plan.trainer.name
          },
          hasAccess: false,
          duration: plan.duration
        };
      }
    });

    res.status(200).json({
      success: true,
      count: formattedPlans.length,
      data: formattedPlans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single fitness plan
// @route   GET /api/plans/:id
// @access  Public
exports.getPlan = async (req, res) => {
  try {
    const plan = await FitnessPlan.findById(req.params.id).populate('trainer', 'name email');

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Fitness plan not found'
      });
    }

    let hasAccess = false;
    if (req.user) {
      const subscription = await Subscription.findOne({
        user: req.user.id,
        plan: plan._id,
        status: 'active',
        expiresAt: { $gt: new Date() }
      });
      hasAccess = !!subscription;
    }

    if (hasAccess) {
      res.status(200).json({
        success: true,
        data: {
          _id: plan._id,           // ✅ CHANGED: from 'id' to '_id'
          title: plan.title,
          description: plan.description,
          price: plan.price,
          duration: plan.duration,
          trainer: plan.trainer,
          hasAccess: true,
          createdAt: plan.createdAt
        }
      });
    } else {
      res.status(200).json({
        success: true,
        data: {
          _id: plan._id,           // ✅ CHANGED: from 'id' to '_id'
          title: plan.title,
          price: plan.price,
          duration: plan.duration,
          trainer: {
            _id: plan.trainer?._id,
            name: plan.trainer?.name
          },
          hasAccess: false,
          message: 'Subscribe to view full details'
        }
      });
    }
  } catch (error) {
    console.error('Error in getPlan:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update fitness plan
// @route   PUT /api/plans/:id
// @access  Private/Trainer
exports.updatePlan = async (req, res) => {
  try {
    let plan = await FitnessPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Fitness plan not found'
      });
    }

    if (plan.trainer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this plan'
      });
    }

    plan = await FitnessPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('trainer', 'name email');

    res.status(200).json({
      success: true,
      message: 'Fitness plan updated successfully',
      data: plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete fitness plan
// @route   DELETE /api/plans/:id
// @access  Private/Trainer
exports.deletePlan = async (req, res) => {
  try {
    const plan = await FitnessPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Fitness plan not found'
      });
    }

    if (plan.trainer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this plan'
      });
    }

    await plan.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Fitness plan deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get trainer's own plans
// @route   GET /api/plans/my-plans
// @access  Private/Trainer
exports.getMyPlans = async (req, res) => {
  try {
    const plans = await FitnessPlan.find({ trainer: req.user.id })
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