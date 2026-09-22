const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const user = JSON.parse(localStorage.getItem('paytodo_user') || 'null');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(user ? { 'x-user-id': String(user.id) } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.headers.get('content-type')?.includes('text/csv')) {
    if (!response.ok) {
      throw new Error('Failed to export CSV');
    }
    return response.blob();
  }

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'API request failed');
    error.status = response.status;
    error.code = data.code;
    throw error;
  }

  return data;
}

export const api = {
  // Users
  enterUser: (name, password) => request('/users/enter', {
    method: 'POST',
    body: JSON.stringify({ name, password })
  }),
  getDemoUsers: () => request('/users/demo-users'),

  // Plans
  getPlans: () => request('/plans'),

  // Subscriptions
  getMySubscription: () => request('/subscriptions/me'),
  cancelSubscription: () => request('/subscriptions/cancel', { method: 'POST' }),
  changePlan: (plan_slug) => request('/subscriptions/change-plan', {
    method: 'POST',
    body: JSON.stringify({ plan_slug })
  }),

  // Payments
  createOrder: (plan_slug) => request('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ plan_slug })
  }),
  verifyPayment: (payload) => request('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getPaymentHistory: () => request('/payments/me'),

  // Tasks
  getTasks: () => request('/tasks'),
  createTask: (taskData) => request('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData)
  }),
  updateTask: (id, updates) => request(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  }),
  deleteTask: (id) => request(`/tasks/${id}`, {
    method: 'DELETE'
  }),
  getAnalytics: () => request('/tasks/analytics'),
  exportCsv: () => request('/tasks/export')
};
