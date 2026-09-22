const fs = require('fs');
const path = require('path');
const db = require('./index');
const { hashPassword } = require('../utils/hash');

async function runMigration() {
  console.log('🔄 Starting PayTodo database migration...');
  const client = await db.pool.connect();

  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await client.query(schemaSql);
    console.log('✅ Base tables and plans schema applied successfully.');

    // Seed Demo Users with different subscriptions (Spec #51)
    const demoUsers = [
      { name: 'Vidit', password: '123', planSlug: 'business', subStatus: 'active' },
      { name: 'Rahul', password: '123', planSlug: 'pro', subStatus: 'active' },
      { name: 'Priya', password: '123', planSlug: 'starter', subStatus: 'active' },
      { name: 'Aman', password: '123', planSlug: 'free', subStatus: 'active' },
      { name: 'Sam', password: '123', planSlug: 'pro', subStatus: 'cancelled' }
    ];

    const plansRes = await client.query('SELECT id, slug, price FROM plans');
    const plansMap = {};
    plansRes.rows.forEach(p => {
      plansMap[p.slug] = p;
    });

    for (const demo of demoUsers) {
      const pHash = hashPassword(demo.password);

      // Upsert user
      const userRes = await client.query(
        `INSERT INTO users (name, password_hash)
         VALUES ($1, $2)
         ON CONFLICT (name, password_hash) DO UPDATE SET updated_at = NOW()
         RETURNING id, name`,
        [demo.name, pHash]
      );
      const userId = userRes.rows[0].id;
      const plan = plansMap[demo.planSlug] || plansMap['free'];

      // Check existing subscription
      const subRes = await client.query(
        `SELECT id FROM subscriptions WHERE user_id = $1`,
        [userId]
      );

      let subId;
      if (subRes.rows.length === 0) {
        const isCancelled = demo.subStatus === 'cancelled';
        const newSub = await client.query(
          `INSERT INTO subscriptions (
            user_id, plan_id, razorpay_subscription_id, status,
            current_period_start, current_period_end, cancel_at_period_end, cancelled_at
          ) VALUES ($1, $2, $3, $4, NOW(), NOW() + INTERVAL '30 days', $5, $6)
          RETURNING id`,
          [
            userId,
            plan.id,
            `sub_demo_${demo.name.toLowerCase()}`,
            demo.subStatus,
            isCancelled,
            isCancelled ? new Date() : null
          ]
        );
        subId = newSub.rows[0].id;

        // Add payment record if paid plan
        if (Number(plan.price) > 0) {
          await client.query(
            `INSERT INTO payments (
              user_id, subscription_id, razorpay_payment_id, razorpay_order_id, amount, status, payment_method, paid_at
            ) VALUES ($1, $2, $3, $4, $5, 'successful', 'upi_demo', NOW())`,
            [
              userId,
              subId,
              `pay_demo_${Date.now()}_${userId}`,
              `order_demo_${Date.now()}_${userId}`,
              plan.price
            ]
          );
        }
      }

      // Seed initial tasks if user has no tasks
      const taskCheck = await client.query(`SELECT COUNT(*) FROM tasks WHERE user_id = $1`, [userId]);
      if (parseInt(taskCheck.rows[0].count, 10) === 0) {
        const sampleTasks = [
          { title: 'Complete PayTodo portfolio project', desc: 'Verify full Razorpay integration and webhooks', cat: 'Work', prio: 'High', comp: false, rec: 'None' },
          { title: 'Study DSA & System Design', desc: 'Revise Graphs and dynamic programming', cat: 'Study', prio: 'High', comp: false, rec: 'Daily' },
          { title: 'Morning Gym Workout', desc: 'Legs and core training session', cat: 'Fitness', prio: 'Medium', comp: true, rec: 'Daily' },
          { title: 'Submit quarterly assignment', desc: 'Upload final PDF with references', cat: 'Study', prio: 'Low', comp: true, rec: 'None' }
        ];

        for (const st of sampleTasks) {
          await client.query(
            `INSERT INTO tasks (user_id, title, description, category, priority, completed, recurrence)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [userId, st.title, st.desc, st.cat, st.prio, st.comp, st.rec]
          );
        }
      }
    }

    console.log('🎉 Migration and demo data seeding completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    throw err;
  } finally {
    client.release();
    await db.pool.end();
  }
}

if (require.main === module) {
  runMigration().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = runMigration;
