import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Honeyfiles
export const honeyfileAPI = {
  create: (data) => api.post('/honeyfiles/create', data),
  list: (skip = 0, limit = 100) => api.get('/honeyfiles/list', { params: { skip, limit } }),
  get: (decoyId) => api.get(`/honeyfiles/${decoyId}`),
}

// Events
export const eventAPI = {
  getLogs: (skip = 0, limit = 100, decoyId = null, hours = 24) =>
    api.get('/events/logs', { params: { skip, limit, decoy_id: decoyId, hours } }),
  getCount: (decoyId = null) =>
    api.get('/events/count', { params: { decoy_id: decoyId } }),
}

// Monitoring
export const monitoringAPI = {
  start: (directories = null) => api.post('/monitor/start', { directories }),
  stop: () => api.post('/monitor/stop'),
  getStatus: () => api.get('/monitor/status'),
}

// Alerts
export const alertAPI = {
  getSettings: () => api.get('/alerts/settings'),
  updateSettings: (data) => api.post('/alerts/settings', data),
  test: (alertType) => api.post('/alerts/test', {}, { params: { alert_type: alertType } }),
}

// Dashboard
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
}

// Health
export const healthAPI = {
  check: () => api.get('/health'),
}

export default api
