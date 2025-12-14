const mongoose = require('mongoose');

const fitnessPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: Number,
    required: [true, 'Please add duration in days'],
    min: [1, 'Duration must be at least 1 day']
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
fitnessPlanSchema.index({ trainer: 1 });
fitnessPlanSchema.index({ price: 1 });

module.exports = mongoose.model('FitnessPlan', fitnessPlanSchema);