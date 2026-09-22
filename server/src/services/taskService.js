const db = require('../db');
const subscriptionService = require('./subscriptionService');

class TaskService {
  /**
   * Get all tasks for a specific user
   */
  async getTasks(userId) {
    const res = await db.query(
      `SELECT id, title, description, category, priority, completed, recurrence, checkbox_style, created_at, updated_at
       FROM tasks
       WHERE user_id = $1
       ORDER BY completed ASC, created_at DESC`,
      [userId]
    );
    return res.rows;
  }

  /**
   * Create a new task with feature-gating validation
   */
  async createTask(userId, data) {
    const { title, description, category = 'General', priority = 'Medium', recurrence = 'None', checkbox_style = 'circle' } = data;

    if (!title || !title.trim()) {
      throw { status: 400, message: 'Task title is required.' };
    }

    const sub = await subscriptionService.getUserSubscription(userId);
    const features = sub.features || [];

    // 1. Check Active Task Limit
    const activeCountRes = await db.query(
      `SELECT COUNT(*) FROM tasks WHERE user_id = $1 AND completed = FALSE`,
      [userId]
    );
    const activeCount = parseInt(activeCountRes.rows[0].count, 10);

    let maxAllowed = 10; // Free plan limit (Spec #9)
    if (features.includes('unlimited_tasks')) {
      maxAllowed = Infinity;
    } else if (features.includes('more_tasks')) {
      maxAllowed = sub.plan === 'starter' ? 50 : 100;
    }

    if (activeCount >= maxAllowed) {
      throw {
        status: 403,
        code: 'LIMIT_REACHED',
        message: `You've reached the ${sub.plan_name} plan limit (${maxAllowed} active tasks). Upgrade to create more tasks.`
      };
    }

    // 2. Feature Gating Checks
    // Categories (Pro & Business)
    if (category && category !== 'General' && !features.includes('categories')) {
      throw {
        status: 403,
        code: 'FEATURE_LOCKED',
        message: 'Custom task categories are available on Pro and Business plans.'
      };
    }

    // Priority labels (Pro & Business)
    if (priority && priority !== 'Medium' && !features.includes('priority_labels')) {
      throw {
        status: 403,
        code: 'FEATURE_LOCKED',
        message: 'Priority labels are available on Pro and Business plans.'
      };
    }

    // Recurring tasks (Business only)
    if (recurrence && recurrence !== 'None' && !features.includes('recurring_tasks')) {
      throw {
        status: 403,
        code: 'FEATURE_LOCKED',
        message: 'Recurring tasks are available exclusively on the Business plan.'
      };
    }

    // Custom checkboxes (Starter, Pro, Business)
    if (checkbox_style && checkbox_style !== 'circle' && !features.includes('custom_checkboxes')) {
      throw {
        status: 403,
        code: 'FEATURE_LOCKED',
        message: 'Custom checkbox styles are available on Starter, Pro, and Business plans.'
      };
    }

    // Insert task
    const res = await db.query(
      `INSERT INTO tasks (user_id, title, description, category, priority, completed, recurrence, checkbox_style)
       VALUES ($1, $2, $3, $4, $5, FALSE, $6, $7)
       RETURNING *`,
      [userId, title.trim(), description ? description.trim() : '', category, priority, recurrence, checkbox_style]
    );

    return res.rows[0];
  }

  /**
   * Update task (toggle complete, edit title/category/priority)
   */
  async updateTask(userId, taskId, updates) {
    // Check ownership
    const existing = await db.query(
      `SELECT * FROM tasks WHERE id = $1 AND user_id = $2`,
      [taskId, userId]
    );

    if (existing.rows.length === 0) {
      throw { status: 404, message: 'Task not found or unauthorized.' };
    }

    const task = existing.rows[0];
    const sub = await subscriptionService.getUserSubscription(userId);
    const features = sub.features || [];

    const title = updates.title !== undefined ? updates.title.trim() : task.title;
    const description = updates.description !== undefined ? updates.description.trim() : task.description;
    const category = updates.category !== undefined ? updates.category : task.category;
    const priority = updates.priority !== undefined ? updates.priority : task.priority;
    const completed = updates.completed !== undefined ? Boolean(updates.completed) : task.completed;
    const recurrence = updates.recurrence !== undefined ? updates.recurrence : task.recurrence;
    const checkbox_style = updates.checkbox_style !== undefined ? updates.checkbox_style : task.checkbox_style;

    // Feature gating checks for updates
    if (category !== 'General' && category !== task.category && !features.includes('categories')) {
      throw { status: 403, code: 'FEATURE_LOCKED', message: 'Task categories require a Pro plan.' };
    }
    if (priority !== 'Medium' && priority !== task.priority && !features.includes('priority_labels')) {
      throw { status: 403, code: 'FEATURE_LOCKED', message: 'Priority labels require a Pro plan.' };
    }
    if (recurrence !== 'None' && recurrence !== task.recurrence && !features.includes('recurring_tasks')) {
      throw { status: 403, code: 'FEATURE_LOCKED', message: 'Recurring tasks require a Business plan.' };
    }

    const res = await db.query(
      `UPDATE tasks
       SET title = $1,
           description = $2,
           category = $3,
           priority = $4,
           completed = $5,
           recurrence = $6,
           checkbox_style = $7,
           updated_at = NOW()
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [title, description, category, priority, completed, recurrence, checkbox_style, taskId, userId]
    );

    const updatedTask = res.rows[0];

    // If marked completed and has recurrence, spawn next cycle task (Spec #30)
    if (!task.completed && completed && recurrence && recurrence !== 'None' && features.includes('recurring_tasks')) {
      await db.query(
        `INSERT INTO tasks (user_id, title, description, category, priority, completed, recurrence, checkbox_style)
         VALUES ($1, $2, $3, $4, $5, FALSE, $6, $7)`,
        [userId, title, `Next recurring cycle of: ${title}`, category, priority, recurrence, checkbox_style]
      );
    }

    return updatedTask;
  }

  /**
   * Delete task
   */
  async deleteTask(userId, taskId) {
    const res = await db.query(
      `DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id`,
      [taskId, userId]
    );

    if (res.rows.length === 0) {
      throw { status: 404, message: 'Task not found or unauthorized.' };
    }

    return { id: taskId, deleted: true };
  }

  /**
   * Analytics for Business Plan (Spec #31)
   */
  async getAnalytics(userId) {
    const hasAnalytics = await subscriptionService.hasFeature(userId, 'task_analytics');
    if (!hasAnalytics) {
      throw {
        status: 403,
        code: 'FEATURE_LOCKED',
        message: 'Task Analytics is exclusively available on the Business plan.'
      };
    }

    const tasksRes = await db.query(`SELECT * FROM tasks WHERE user_id = $1`, [userId]);
    const tasks = tasksRes.rows;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Category distribution
    const categoryMap = {};
    tasks.forEach(t => {
      const cat = t.category || 'General';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const categories = Object.keys(categoryMap).map(name => ({
      name,
      count: categoryMap[name]
    }));

    // Priority distribution
    const priorityMap = { High: 0, Medium: 0, Low: 0 };
    tasks.forEach(t => {
      const prio = t.priority || 'Medium';
      priorityMap[prio] = (priorityMap[prio] || 0) + 1;
    });

    const priorities = Object.keys(priorityMap).map(name => ({
      name,
      count: priorityMap[name]
    }));

    return {
      totalTasks,
      completedTasks,
      activeTasks,
      completionRate,
      categories,
      priorities
    };
  }

  /**
   * Export tasks as CSV for Business Plan (Spec #32)
   */
  async exportCsv(userId) {
    const hasExport = await subscriptionService.hasFeature(userId, 'export_tasks');
    if (!hasExport) {
      throw {
        status: 403,
        code: 'FEATURE_LOCKED',
        message: 'Task Export is exclusively available on the Business plan.'
      };
    }

    const tasks = await this.getTasks(userId);

    const headers = ['ID', 'Title', 'Description', 'Category', 'Priority', 'Status', 'Recurrence', 'Created At'];
    const rows = tasks.map(t => [
      t.id,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      `"${t.category || 'General'}"`,
      `"${t.priority || 'Medium'}"`,
      t.completed ? 'Completed' : 'Active',
      `"${t.recurrence || 'None'}"`,
      new Date(t.created_at).toISOString().split('T')[0]
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    return csvContent;
  }
}

module.exports = new TaskService();
