const crypto = require('crypto');
const db = require('../db');
const subscriptionService = require('./subscriptionService');

class WebhookService {
  /**
   * Verify Razorpay Webhook signature
   */
  verifyWebhookSignature(rawBody, signature, secret) {
    if (!secret || secret === 'placeholder_webhook_secret_789') {
      return true; // Allow testing in sandbox/dev mode
    }
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');
    return expectedSignature === signature;
  }

  /**
   * Process incoming Razorpay webhook with full idempotency (Spec #16 & #17)
   */
  async handleWebhook(eventData, rawBody, signature) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder_webhook_secret_789';

    // 1. Verify Signature
    if (signature && !this.verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      throw { status: 400, message: 'Invalid webhook signature.' };
    }

    const eventId = eventData.event_id || eventData.id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const eventType = eventData.event || 'unknown';
    const payload = eventData.payload || {};

    // 2. Idempotency Check in DB
    const existingEvent = await db.query(
      `SELECT id, processed FROM webhook_events WHERE event_id = $1`,
      [eventId]
    );

    if (existingEvent.rows.length > 0 && existingEvent.rows[0].processed) {
      console.log(`ℹ️ Webhook event ${eventId} already processed. Skipping duplicate.`);
      return {
        idempotent: true,
        message: 'Event already processed.'
      };
    }

    // 3. Store Event in DB if not recorded yet
    let webhookDbId;
    if (existingEvent.rows.length === 0) {
      const insertEvt = await db.query(
        `INSERT INTO webhook_events (event_id, event_type, payload, processed)
         VALUES ($1, $2, $3, FALSE)
         RETURNING id`,
        [eventId, eventType, JSON.stringify(eventData)]
      );
      webhookDbId = insertEvt.rows[0].id;
    } else {
      webhookDbId = existingEvent.rows[0].id;
    }

    // 4. Process event logic
    try {
      if (eventType === 'payment.captured' || eventType === 'order.paid') {
        const paymentEntity = payload.payment ? payload.payment.entity : payload;
        const notes = paymentEntity.notes || {};
        const userId = notes.user_id ? parseInt(notes.user_id, 10) : null;
        const planSlug = notes.plan_slug;

        if (userId && planSlug) {
          await subscriptionService.activateUserPlan(
            userId,
            planSlug,
            paymentEntity.id || `sub_rzp_${Date.now()}`
          );
        }
      } else if (eventType === 'subscription.cancelled') {
        const subEntity = payload.subscription ? payload.subscription.entity : payload;
        const rzpSubId = subEntity.id;
        if (rzpSubId) {
          await db.query(
            `UPDATE subscriptions 
             SET status = 'cancelled', cancelled_at = NOW(), updated_at = NOW() 
             WHERE razorpay_subscription_id = $1`,
            [rzpSubId]
          );
        }
      }

      // 5. Mark event as processed
      await db.query(
        `UPDATE webhook_events
         SET processed = TRUE, processed_at = NOW()
         WHERE id = $1`,
        [webhookDbId]
      );

      return {
        success: true,
        eventId,
        eventType,
        message: 'Webhook processed successfully.'
      };
    } catch (err) {
      console.error(`❌ Error processing webhook event ${eventId}:`, err);
      throw err;
    }
  }
}

module.exports = new WebhookService();
