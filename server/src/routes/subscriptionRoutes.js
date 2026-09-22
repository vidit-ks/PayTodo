const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const userContext = require('../middleware/userContext');

// All subscription routes require user context
router.use(userContext);

router.get('/me', subscriptionController.getMe);
router.post('/cancel', subscriptionController.cancel);
router.post('/change-plan', subscriptionController.changePlan);

module.exports = router;
