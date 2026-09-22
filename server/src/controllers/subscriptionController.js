const subscriptionService = require('../services/subscriptionService');

class SubscriptionController {
  async getMe(req, res, next) {
    try {
      const subscription = await subscriptionService.getUserSubscription(req.user.id);
      res.json({
        success: true,
        subscription
      });
    } catch (err) {
      next(err);
    }
  }

  async cancel(req, res, next) {
    try {
      const result = await subscriptionService.cancelSubscription(req.user.id);
      res.json({
        success: true,
        message: 'Subscription marked to cancel at the end of the billing period.',
        subscription: result
      });
    } catch (err) {
      next(err);
    }
  }

  async changePlan(req, res, next) {
    try {
      const { plan_slug } = req.body;
      if (!plan_slug) {
        return res.status(400).json({ success: false, message: 'Plan slug is required.' });
      }
      const result = await subscriptionService.activateUserPlan(req.user.id, plan_slug);
      res.json({
        success: true,
        message: `Plan changed to ${result.plan.name} successfully.`,
        plan: result.plan
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SubscriptionController();
