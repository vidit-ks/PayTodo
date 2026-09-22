const taskService = require('../services/taskService');

class TaskController {
  async getTasks(req, res, next) {
    try {
      const tasks = await taskService.getTasks(req.user.id);
      res.json({
        success: true,
        tasks
      });
    } catch (err) {
      next(err);
    }
  }

  async createTask(req, res, next) {
    try {
      const task = await taskService.createTask(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Task created successfully.',
        task
      });
    } catch (err) {
      next(err);
    }
  }

  async updateTask(req, res, next) {
    try {
      const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
      res.json({
        success: true,
        message: 'Task updated successfully.',
        task
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const result = await taskService.deleteTask(req.user.id, req.params.id);
      res.json({
        success: true,
        message: 'Task deleted successfully.',
        result
      });
    } catch (err) {
      next(err);
    }
  }

  async getAnalytics(req, res, next) {
    try {
      const analytics = await taskService.getAnalytics(req.user.id);
      res.json({
        success: true,
        analytics
      });
    } catch (err) {
      next(err);
    }
  }

  async exportCsv(req, res, next) {
    try {
      const csv = await taskService.exportCsv(req.user.id);
      res.header('Content-Type', 'text/csv');
      res.attachment(`paytodo_tasks_${Date.now()}.csv`);
      res.send(csv);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TaskController();
