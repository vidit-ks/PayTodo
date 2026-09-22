const planService = require('../services/planService');

class PlanController {
  async getAll(req, res, next) {
    try {
      const plans = await planService.getAllPlans();
      res.json({
        success: true,
        plans
      });
    } catch (err) {
      next(err);
    }
  }

  async getBySlug(req, res, next) {
    try {
      const plan = await planService.getPlanBySlug(req.params.slug);
      res.json({
        success: true,
        plan
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PlanController();
