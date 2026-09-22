const db = require('./index');

async function fixDemoTasks() {
  console.log('Fixing demo users tasks to match exact subscription levels...');
  
  // 1. Aman (Free) -> No categories, No priorities, No recurrence, standard circle checkbox
  await db.query(`
    UPDATE tasks 
    SET category = 'General', 
        priority = 'Medium', 
        recurrence = 'None', 
        checkbox_style = 'circle'
    WHERE user_id IN (SELECT id FROM users WHERE name = 'Aman')
  `);

  // 2. Priya (Starter) -> Custom checkboxes allowed, but NO categories, NO priorities, NO recurrence
  await db.query(`
    UPDATE tasks 
    SET category = 'General', 
        priority = 'Medium', 
        recurrence = 'None'
    WHERE user_id IN (SELECT id FROM users WHERE name = 'Priya')
  `);

  // 3. Rahul (Pro) -> Custom checkboxes, Priorities, Categories allowed, but NO recurrence
  await db.query(`
    UPDATE tasks 
    SET recurrence = 'None'
    WHERE user_id IN (SELECT id FROM users WHERE name = 'Rahul')
  `);

  // 4. Vidit (Business) -> All features unlocked (Recurrence, Priority, Categories, Checkboxes)

  console.log('Demo tasks accurately aligned with subscription tiers!');
}

fixDemoTasks().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
