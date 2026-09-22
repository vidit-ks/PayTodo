const db = require('../db');
const { hashPassword } = require('../utils/hash');

class UserService {
  /**
   * Enter PayTodo: Look up demo user by name and hashed password.
   * If not found, auto-create the demo user and give them an initial Free subscription.
   */
  async enterUser(name, password) {
    const trimmedName = String(name || '').trim();
    if (!trimmedName) {
      throw { status: 400, message: 'Please enter your name.' };
    }
    if (!password) {
      throw { status: 400, message: 'Please enter your password.' };
    }

    const pHash = hashPassword(password);

    // 1. Check if user exists with matching hash
    const existing = await db.query(
      `SELECT id, name, created_at FROM users WHERE name = $1 AND password_hash = $2`,
      [trimmedName, pHash]
    );

    if (existing.rows.length > 0) {
      const user = existing.rows[0];
      return {
        id: user.id,
        name: user.name,
        isNew: false
      };
    }

    // 2. Check if name exists with DIFFERENT password
    const nameCheck = await db.query(
      `SELECT id FROM users WHERE name = $1`,
      [trimmedName]
    );

    if (nameCheck.rows.length > 0) {
      // Different password for same name => allow separate user entry or reject if exact collision
      // In our design: (name, password_hash) is unique, so different password creates distinct demo user
    }

    // 3. Create new demo user
    const newUser = await db.query(
      `INSERT INTO users (name, password_hash)
       VALUES ($1, $2)
       RETURNING id, name, created_at`,
      [trimmedName, pHash]
    );

    const createdUser = newUser.rows[0];

    // Assign Free Plan by default
    const freePlan = await db.query(`SELECT id FROM plans WHERE slug = 'free'`);
    const freePlanId = freePlan.rows[0]?.id;

    if (freePlanId) {
      await db.query(
        `INSERT INTO subscriptions (
          user_id, plan_id, status, current_period_start, current_period_end
        ) VALUES ($1, $2, 'active', NOW(), NOW() + INTERVAL '30 days')`,
        [createdUser.id, freePlanId]
      );
    }

    // Add sample initial task
    await db.query(
      `INSERT INTO tasks (user_id, title, description, category, priority, completed)
       VALUES ($1, 'Welcome to PayTodo', 'Explore task management, upgrade plans, or configure settings.', 'General', 'Medium', false)`,
      [createdUser.id]
    );

    return {
      id: createdUser.id,
      name: createdUser.name,
      isNew: true
    };
  }

  /**
   * Get list of the 4 canonical demo users for demonstration switching
   */
  async getDemoUsers() {
    const res = await db.query(
      `SELECT DISTINCT ON (u.name) u.id, u.name, p.slug as plan_slug, p.name as plan_name, s.status as sub_status
       FROM users u
       JOIN subscriptions s ON s.user_id = u.id
       JOIN plans p ON s.plan_id = p.id
       WHERE u.name IN ('Vidit', 'Rahul', 'Priya', 'Aman')
       ORDER BY u.name, u.id ASC`
    );

    // Sort in consistent order: Vidit (Business), Rahul (Pro), Priya (Starter), Aman (Free)
    const order = { 'Vidit': 1, 'Rahul': 2, 'Priya': 3, 'Aman': 4 };
    return res.rows.sort((a, b) => (order[a.name] || 99) - (order[b.name] || 99));
  }
}

module.exports = new UserService();
