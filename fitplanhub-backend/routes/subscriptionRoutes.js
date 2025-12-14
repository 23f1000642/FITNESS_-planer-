const express = require('express');
const router = express.Router();
const {
  subscribeToPlan,
  getMySubscriptions,
  checkSubscription
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

router.post('/:planId', protect, subscribeToPlan);
router.get('/', protect, getMySubscriptions);
router.get('/check/:planId', protect, checkSubscription);

module.exports = router;