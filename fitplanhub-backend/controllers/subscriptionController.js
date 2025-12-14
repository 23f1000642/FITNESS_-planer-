const Subscription = require('../models/Subscription');
const FitnessPlan = require('../models/FitnessPlan');

// @desc    Subscribe to a fitness plan
// @route   POST /api/subscriptions/:planId
// @access  Private/User
exports.subscribeToPlan = async (req, res) => {
  try {
    const planId = req.params.planId;

    const plan = await FitnessPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Fitness plan not found'
      });
    }

    const existingSubscription = await Subscription.findOne({
      user: req.user.id,
      plan: planId,
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active subscription to this plan'
      });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.duration);

    const subscription = await Subscription.create({
      user: req.user.id,
      plan: planId,
      expiresAt,
      status: 'active'
    });

    await subscription.populate('plan');

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to the plan',
      data: {
        subscriptionId: subscription._id,
        plan: subscription.plan,
        purchaseDate: subscription.purchaseDate,
        expiresAt: subscription.expiresAt,
        status: subscription.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's subscriptions
// @route   GET /api/subscriptions
// @access  Private/User
exports.getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id })
      .populate({
        path: 'plan',
        populate: {
          path: 'trainer',
          select: 'name email'
        }
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check subscription status for a plan
// @route   GET /api/subscriptions/check/:planId
// @access  Private
exports.checkSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user.id,
      plan: req.params.planId,
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

    res.status(200).json({
      success: true,
      data: {
        hasAccess: !!subscription,
        subscription: subscription || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};