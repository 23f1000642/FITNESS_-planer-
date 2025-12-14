const express = require('express');
const router = express.Router();
const {
  followTrainer,
  unfollowTrainer,
  getMyFollows,
  checkFollow,
  getFeed
} = require('../controllers/followController');
const { protect } = require('../middleware/auth');

router.post('/:trainerId', protect, followTrainer);
router.delete('/:trainerId', protect, unfollowTrainer);
router.get('/', protect, getMyFollows);
router.get('/check/:trainerId', protect, checkFollow);
router.get('/feed/personalized', protect, getFeed);

module.exports = router;