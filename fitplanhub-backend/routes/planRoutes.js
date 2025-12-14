const express = require('express');
const router = express.Router();
const {
  createPlan,
  getAllPlans,
  getPlan,
  updatePlan,
  deletePlan,
  getMyPlans
} = require('../controllers/planController');
const { protect, authorize } = require('../middleware/auth');

// Public route - get all plans (optional auth)
router.get('/', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    protect(req, res, next);
  } else {
    next();
  }
}, getAllPlans);

// IMPORTANT: Specific routes MUST come BEFORE parameterized routes
// This must be before /:id route
router.get('/trainer/my-plans', protect, authorize('trainer'), getMyPlans);

// Protected trainer routes for create
router.post('/', protect, authorize('trainer'), createPlan);

// Parameterized routes - must be AFTER all specific routes
router.get('/:id', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    protect(req, res, next);
  } else {
    next();
  }
}, getPlan);

router.put('/:id', protect, authorize('trainer'), updatePlan);
router.delete('/:id', protect, authorize('trainer'), deletePlan);

module.exports = router;