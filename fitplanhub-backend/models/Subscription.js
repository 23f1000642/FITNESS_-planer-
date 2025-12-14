const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FitnessPlan',
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Compound index
subscriptionSchema.index({ user: 1, plan: 1 });
subscriptionSchema.index({ user: 1, status: 1 });

// Method to check if subscription is active
subscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && this.expiresAt > new Date();
};

module.exports = mongoose.model('Subscription', subscriptionSchema);