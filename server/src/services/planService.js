const db = require('../db');

class PlanService {
  async getAllPlans() {
    const res = await db.query(
      `SELECT id, name, slug, price, billing_interval, description, features, is_active
       FROM plans
       WHERE is_active = TRUE
       ORDER BY price ASC`
    );
    return res.rows;
  }

  async getPlanBySlug(slug) {
    const res = await db.query(
      `SELECT id, name, slug, price, billing_interval, description, features, is_active
       FROM plans
       WHERE slug = $1`,
      [slug]
    );
    if (res.rows.length === 0) {
      throw { status: 404, message: `Plan '${slug}' not found.` };
    }
    return res.rows[0];
  }
}

module.exports = new PlanService();
