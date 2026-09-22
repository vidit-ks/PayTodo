const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Entry endpoint (name + password)
router.post('/enter', userController.enter);

// Demo users list for quick preview / demo switching
router.get('/demo-users', userController.getDemoUsers);

module.exports = router;
