const paymentService = require('../services/paymentService');

class PaymentController {
  async createOrder(req, res, next) {
    try {
      const { plan_slug } = req.body;
      if (!plan_slug) {
        return res.status(400).json({ success: false, message: 'Plan slug is required.' });
      }
      const order = await paymentService.createOrder(req.user.id, plan_slug);
      res.json({
        success: true,
        order
      });
    } catch (err) {
      next(err);
    }
  }

  async verify(req, res, next) {
    try {
      const result = await paymentService.verifyPayment(req.user.id, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getMe(req, res, next) {
    try {
      const payments = await paymentService.getPaymentHistory(req.user.id);
      res.json({
        success: true,
        payments
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PaymentController();
