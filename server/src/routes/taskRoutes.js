const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const userContext = require('../middleware/userContext');

// Task routes require user context
router.use(userContext);

router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.get('/analytics', taskController.getAnalytics);
router.get('/export', taskController.exportCsv);

module.exports = router;
