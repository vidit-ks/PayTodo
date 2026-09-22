const webhookService = require('../services/webhookService');

class WebhookController {
  async handleRazorpayWebhook(req, res, next) {
    try {
      const signature = req.headers['x-razorpay-signature'];
      const rawBody = req.rawBody || JSON.stringify(req.body);

      const result = await webhookService.handleWebhook(req.body, rawBody, signature);
      res.status(200).json(result);
    } catch (err) {
      console.error('Webhook error:', err);
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Webhook processing failed'
      });
    }
  }
}

module.exports = new WebhookController();
