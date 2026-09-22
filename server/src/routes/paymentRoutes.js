const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const userContext = require('../middleware/userContext');

// Payment routes require user context
router.use(userContext);

router.post('/create-order', paymentController.createOrder);
router.post('/verify', paymentController.verify);
router.get('/me', paymentController.getMe);

module.exports = router;
