const db = require('../db');

class SubscriptionService {
  /**
   * Get user's active subscription details, plan info, and unlocked features list.
   */
  async getUserSubscription(userId) {
    const res = await db.query(
      `SELECT 
        s.id as subscription_id,
        s.status,
        s.current_period_start,
        s.current_period_end,
        s.cancel_at_period_end,
        s.cancelled_at,
        s.razorpay_subscription_id,
        p.id as plan_id,
        p.name as plan_name,
        p.slug as plan_slug,
        p.price,
        p.billing_interval,
        p.features
       FROM subscriptions s
       JOIN plans p ON s.plan_id = p.id
       WHERE s.user_id = $1
       ORDER BY s.id DESC
       LIMIT 1`,
      [userId]
    );

    if (res.rows.length === 0) {
      // If no subscription record found, fallback to Free plan
      const freePlan = await db.query(`SELECT * FROM plans WHERE slug = 'free'`);
      const free = freePlan.rows[0];
      return {
        subscription_id: null,
        status: 'active',
        plan: free ? free.slug : 'free',
        plan_name: free ? free.name : 'Free',
        price: 0,
        features: free ? (typeof free.features === 'string' ? JSON.parse(free.features) : free.features) : ['basic_tasks'],
        current_period_start: new Date(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancel_at_period_end: false
      };
    }

    const row = res.rows[0];
    const featuresList = typeof row.features === 'string' ? JSON.parse(row.features) : row.features;

    return {
      subscription_id: row.subscription_id,
      status: row.status,
      plan: row.plan_slug,
      plan_name: row.plan_name,
      price: Number(row.price),
      features: featuresList || [],
      current_period_start: row.current_period_start,
      current_period_end: row.current_period_end,
      cancel_at_period_end: row.cancel_at_period_end,
      cancelled_at: row.cancelled_at
    };
  }

  /**
   * Check whether user has access to a specific feature
   */
  async hasFeature(userId, featureName) {
    const sub = await this.getUserSubscription(userId);
    if (sub.status !== 'active' && !sub.cancel_at_period_end) {
      return false;
    }
    return Array.isArray(sub.features) && sub.features.includes(featureName);
  }

  /**
   * Cancel subscription at period end (Spec #26)
   */
  async cancelSubscription(userId) {
    const sub = await db.query(
      `SELECT id, status FROM subscriptions WHERE user_id = $1 ORDER BY id DESC LIMIT 1`,
      [userId]
    );

    if (sub.rows.length === 0) {
      throw { status: 404, message: 'No active subscription found.' };
    }

    const subId = sub.rows[0].id;
    const updated = await db.query(
      `UPDATE subscriptions 
       SET cancel_at_period_end = TRUE, 
           cancelled_at = NOW(),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [subId]
    );

    return updated.rows[0];
  }

  /**
   * Upgrade or activate a subscription for a user
   */
  async activateUserPlan(userId, planSlug, razorpaySubId = null) {
    const planRes = await db.query(`SELECT id, price, slug FROM plans WHERE slug = $1`, [planSlug]);
    if (planRes.rows.length === 0) {
      throw { status: 404, message: 'Plan not found.' };
    }
    const plan = planRes.rows[0];

    // Check existing subscription
    const existing = await db.query(
      `SELECT id FROM subscriptions WHERE user_id = $1 ORDER BY id DESC LIMIT 1`,
      [userId]
    );

    let subscriptionId;
    if (existing.rows.length > 0) {
      const updateRes = await db.query(
        `UPDATE subscriptions
         SET plan_id = $1,
             status = 'active',
             razorpay_subscription_id = COALESCE($2, razorpay_subscription_id),
             cancel_at_period_end = FALSE,
             cancelled_at = NULL,
             current_period_start = NOW(),
             current_period_end = NOW() + INTERVAL '30 days',
             updated_at = NOW()
         WHERE id = $3
         RETURNING id`,
        [plan.id, razorpaySubId, existing.rows[0].id]
      );
      subscriptionId = updateRes.rows[0].id;
    } else {
      const insertRes = await db.query(
        `INSERT INTO subscriptions (
          user_id, plan_id, razorpay_subscription_id, status,
          current_period_start, current_period_end
        ) VALUES ($1, $2, $3, 'active', NOW(), NOW() + INTERVAL '30 days')
        RETURNING id`,
        [userId, plan.id, razorpaySubId]
      );
      subscriptionId = insertRes.rows[0].id;
    }

    return { subscriptionId, plan };
  }
}

module.exports = new SubscriptionService();
