import axios from 'axios'

// Base URL: em dev usa o proxy do Vite (/api → backend). Em prod, defina VITE_API_URL.
const baseURL = import.meta.env.VITE_API_URL || ''

export const api = axios.create({
  baseURL,
  timeout: 15000,
})

// ── Endpoints tipados (camada de serviço) ──────────────────────
export const API = {
  meta: () => api.get('/api/meta').then((r) => r.data),
  dashboard: () => api.get('/api/dashboard').then((r) => r.data),

  clusters: () => api.get('/api/clusters').then((r) => r.data),
  createCluster: (body) => api.post('/api/clusters', body).then((r) => r.data),
  deleteCluster: (id) => api.delete(`/api/clusters/${id}`).then((r) => r.data),
  editCluster: (id, body) => api.put(`/api/clusters/${id}`, body).then((r) => r.data),
  addNode: (id, body) => api.post(`/api/clusters/${id}/nodes`, body).then((r) => r.data),
  stepDown: (id, nodeIdx) => api.post(`/api/clusters/${id}/stepdown?node_idx=${nodeIdx}`).then((r) => r.data),
  upgradeCluster: (id, body) => api.post(`/api/clusters/${id}/upgrade`, body).then((r) => r.data),

  automation: () => api.get('/api/automation').then((r) => r.data),
  applyPending: (pid) => api.post(`/api/automation/pending/${pid}/apply`).then((r) => r.data),
  discardPending: (pid) => api.delete(`/api/automation/pending/${pid}`).then((r) => r.data),
  agents: () => api.get('/api/agents').then((r) => r.data),
  upgradeAgents: () => api.post('/api/agents/upgrade').then((r) => r.data),

  metrics: (id) => api.get(`/api/metrics/${id}`).then((r) => r.data),
  realtime: (id) => api.get(`/api/realtime/${id}`).then((r) => r.data),
  perfAdvisor: () => api.get('/api/perf-advisor').then((r) => r.data),
  createIndex: (idx) => api.post(`/api/perf-advisor/index/${idx}`).then((r) => r.data),

  backup: () => api.get('/api/backup').then((r) => r.data),
  takeSnapshot: (cluster) => api.post(`/api/backup/snapshot?cluster=${encodeURIComponent(cluster)}`).then((r) => r.data),
  deleteSnapshot: (sid) => api.delete(`/api/backup/snapshot/${sid}`).then((r) => r.data),

  alerts: () => api.get('/api/alerts').then((r) => r.data),
  resolveAlert: (aid) => api.post(`/api/alerts/${aid}/resolve`).then((r) => r.data),
  addAlertConfig: (body) => api.post('/api/alerts/configs', body).then((r) => r.data),
  deleteAlertConfig: (idx) => api.delete(`/api/alerts/configs/${idx}`).then((r) => r.data),

  users: () => api.get('/api/users').then((r) => r.data),
  addUser: (body) => api.post('/api/users', body).then((r) => r.data),
  deleteUser: (name) => api.delete(`/api/users/${name}`).then((r) => r.data),
  roles: () => api.get('/api/roles').then((r) => r.data),
  addRole: (body) => api.post('/api/roles', body).then((r) => r.data),
  deleteRole: (idx) => api.delete(`/api/roles/${idx}`).then((r) => r.data),
  ips: () => api.get('/api/security/ip').then((r) => r.data),
  addIp: (body) => api.post('/api/security/ip', body).then((r) => r.data),
  deleteIp: (idx) => api.delete(`/api/security/ip/${idx}`).then((r) => r.data),
  audit: () => api.get('/api/audit').then((r) => r.data),

  activity: () => api.get('/api/activity').then((r) => r.data),
  reset: () => api.post('/api/reset').then((r) => r.data),
}
