// ──────────────────────────────────────────────────────────────
// MODO MOCK — replica o backend FastAPI 100% no cliente.
// Usado no build estático (GitHub Pages) onde não há backend Python.
// Mesma interface do RealAPI (axios) — todos os métodos retornam Promise.
// ──────────────────────────────────────────────────────────────

const seed = () => JSON.parse(JSON.stringify(SEED))

const SEED = {
  org: 'MongoDB Brazil',
  project: 'Production',
  clusters: [
    { id: 'rs-prod-01', type: 'rs', name: 'rs-prod-01', version: '7.0.5', status: 'warning', nodes: [
      { host: 'mongo-node-01.mongodb-brazil.internal:27017', role: 'PRIMARY', version: '7.0.5', status: 'green', uptime: '14d 6h', conn: 342, disk: 62, lag: '—' },
      { host: 'mongo-node-02.mongodb-brazil.internal:27017', role: 'SECONDARY', version: '7.0.5', status: 'yellow', uptime: '14d 6h', conn: 201, disk: 91, lag: '0.8s' },
      { host: 'mongo-node-03.mongodb-brazil.internal:27017', role: 'SECONDARY', version: '7.0.5', status: 'green', uptime: '14d 6h', conn: 198, disk: 58, lag: '0.2s' },
    ]},
    { id: 'sharded-analytics', type: 'sharded', name: 'sharded-analytics', version: '7.0.5', status: 'healthy', nodes: [
      { host: 'mongos-01.mongodb-brazil.internal:27017', role: 'mongos', version: '7.0.5', status: 'green', uptime: '30d', conn: 520, disk: 0, lag: '—' },
      { host: 'shard-01-n1.mongodb-brazil.internal:27018', role: 'Shard PRIMARY', version: '7.0.5', status: 'green', uptime: '30d', conn: 180, disk: 45, lag: '—' },
      { host: 'shard-02-n1.mongodb-brazil.internal:27018', role: 'Shard PRIMARY', version: '7.0.5', status: 'green', uptime: '30d', conn: 165, disk: 51, lag: '—' },
      { host: 'configsvr-01.mongodb-brazil.internal:27019', role: 'Config Server', version: '7.0.5', status: 'green', uptime: '30d', conn: 12, disk: 18, lag: '—' },
    ]},
    { id: 'rs-staging', type: 'rs', name: 'rs-staging', version: '6.0.12', status: 'healthy', nodes: [
      { host: 'stg-mongo-01.mongodb-brazil.internal:27017', role: 'PRIMARY', version: '6.0.12', status: 'green', uptime: '5d', conn: 42, disk: 22, lag: '—' },
      { host: 'stg-mongo-02.mongodb-brazil.internal:27017', role: 'SECONDARY', version: '6.0.12', status: 'green', uptime: '5d', conn: 38, disk: 21, lag: '0.1s' },
    ]},
    { id: 'mongo-dev-01', type: 'standalone', name: 'mongo-dev-01', version: '7.0.5', status: 'healthy', nodes: [
      { host: 'dev-mongo.mongodb-brazil.internal:27017', role: 'Standalone', version: '7.0.5', status: 'green', uptime: '2d', conn: 8, disk: 12, lag: '—' },
    ]},
  ],
  snapshots: [
    { id: 'snap-00142', cluster: 'rs-prod-01', type: 'Automated', created: '2024-01-15 08:00', size: '42 GB', expires: '2024-02-14', status: 'ready' },
    { id: 'snap-00141', cluster: 'rs-prod-01', type: 'Automated', created: '2024-01-15 02:00', size: '41 GB', expires: '2024-02-14', status: 'ready' },
    { id: 'snap-00140', cluster: 'rs-prod-01', type: 'Automated', created: '2024-01-14 20:00', size: '40 GB', expires: '2024-02-13', status: 'ready' },
    { id: 'snap-00139', cluster: 'rs-prod-01', type: 'Manual', created: '2024-01-14 14:00', size: '40 GB', expires: '2024-02-13', status: 'ready' },
    { id: 'snap-00138', cluster: 'sharded-analytics', type: 'Automated', created: '2024-01-15 06:00', size: '218 GB', expires: '2024-01-29', status: 'ready' },
    { id: 'snap-00137', cluster: 'sharded-analytics', type: 'Automated', created: '2024-01-14 18:00', size: '215 GB', expires: '2024-01-28', status: 'ready' },
    { id: 'snap-00136', cluster: 'rs-staging', type: 'Automated', created: '2024-01-15 09:00', size: '18 GB', expires: '2024-01-22', status: 'ready' },
    { id: 'snap-00135', cluster: 'rs-staging', type: 'Automated', created: '2024-01-14 21:00', size: '17 GB', expires: '2024-01-21', status: 'ready' },
  ],
  snapshot_base: 100,
  users: [
    { name: 'admin', auth: 'SCRAM-SHA-256', roles: ['root@admin'], db: 'admin', created: '2023-06-01', status: 'active' },
    { name: 'app_service', auth: 'SCRAM-SHA-256', roles: ['readWrite@app_db'], db: 'app_db', created: '2023-08-12', status: 'active' },
    { name: 'analytics_ro', auth: 'SCRAM-SHA-256', roles: ['read@analytics'], db: 'analytics', created: '2023-09-03', status: 'active' },
    { name: 'backup_user', auth: 'SCRAM-SHA-256', roles: ['backup@admin'], db: 'admin', created: '2023-06-15', status: 'active' },
    { name: 'monitor_svc', auth: 'x.509', roles: ['clusterMonitor@admin'], db: '$external', created: '2023-07-20', status: 'active' },
    { name: 'legacy_app', auth: 'SCRAM-SHA-1', roles: ['readWrite@legacy'], db: 'legacy', created: '2022-12-01', status: 'disabled' },
  ],
  roles: [
    { name: 'analyticsReadOnly', priv: 'find, listCollections, collStats', inherits: 'read', users: 3 },
    { name: 'appWriter', priv: 'find, insert, update, remove', inherits: 'readWrite', users: 5 },
    { name: 'indexManager', priv: 'createIndex, dropIndex, listIndexes', inherits: '(none)', users: 1 },
  ],
  alerts_open: [
    { id: 1, sev: 'crit', title: 'Disk utilization above 90%', target: 'rs-prod-01 / mongo-node-02', detail: 'Current: 91% · Threshold: 90%', time: '2 min ago' },
    { id: 2, sev: 'warn', title: 'Replication lag above threshold', target: 'rs-prod-01 / mongo-node-02', detail: 'Current: 0.8s · Threshold: 0.5s', time: '18 min ago' },
    { id: 3, sev: 'warn', title: 'High connection count', target: 'sharded-analytics / mongos-01', detail: 'Current: 520 · Threshold: 500', time: '1h ago' },
  ],
  alerts_closed_count: 28,
  alert_configs: [
    { cond: 'Host is down', target: 'All clusters', thresh: '—', notify: 'Email, PagerDuty', on: true },
    { cond: 'Disk space % used is above', target: 'All clusters', thresh: '90%', notify: 'Email, Slack', on: true },
    { cond: 'CPU utilization is above', target: 'rs-prod-01', thresh: '85%', notify: 'Email', on: true },
    { cond: 'Connections is above', target: 'All clusters', thresh: '500', notify: 'Slack', on: true },
    { cond: 'Replication lag is above', target: 'rs-prod-01', thresh: '0.5s', notify: 'Email, PagerDuty', on: true },
    { cond: 'Page faults is above', target: 'All clusters', thresh: '100/s', notify: 'Email', on: false },
  ],
  pending_changes: [
    { id: 'pc-1', cluster: 'rs-prod-01', type: 'Version Upgrade', desc: '7.0.5 → 7.0.6 (rolling upgrade)', by: 'admin@mongodb-brazil.com', time: '30 min ago' },
    { id: 'pc-2', cluster: 'sharded-analytics', type: 'Config Change', desc: 'WiredTiger cache 4GB → 8GB', by: 'john.doe@mongodb-brazil.com', time: '1h ago' },
  ],
  automation_history: [
    { time: '2024-01-15 10:42', cluster: 'rs-prod-01', change: 'Oplog size 5GB → 10GB', status: 'success', duration: '4m 12s', by: 'admin' },
    { time: '2024-01-14 22:10', cluster: 'rs-staging', change: 'Version upgrade 6.0.11 → 6.0.12', status: 'success', duration: '12m 30s', by: 'System' },
    { time: '2024-01-14 14:00', cluster: 'sharded-analytics', change: 'Added shard shard-02', status: 'success', duration: '8m 05s', by: 'john.doe' },
    { time: '2024-01-13 09:00', cluster: 'rs-prod-01', change: 'TLS certificate rotation', status: 'success', duration: '6m 18s', by: 'admin' },
    { time: '2024-01-12 16:30', cluster: 'rs-prod-01', change: 'Add hidden secondary node', status: 'failed', duration: '2m 01s', by: 'admin' },
  ],
  agents: [
    { host: 'mongo-node-01.mongodb-brazil.internal', status: 'Running', version: '12.0.27', type: 'Automation + Monitoring + Backup', ping: '5s ago', cluster: 'rs-prod-01' },
    { host: 'mongo-node-02.mongodb-brazil.internal', status: 'Running', version: '12.0.27', type: 'Automation + Monitoring + Backup', ping: '5s ago', cluster: 'rs-prod-01' },
    { host: 'mongo-node-03.mongodb-brazil.internal', status: 'Running', version: '12.0.27', type: 'Automation + Monitoring + Backup', ping: '7s ago', cluster: 'rs-prod-01' },
    { host: 'mongos-01.mongodb-brazil.internal', status: 'Running', version: '12.0.27', type: 'Automation + Monitoring', ping: '4s ago', cluster: 'sharded-analytics' },
    { host: 'shard-01-n1.mongodb-brazil.internal', status: 'Running', version: '12.0.27', type: 'Automation + Monitoring + Backup', ping: '6s ago', cluster: 'sharded-analytics' },
    { host: 'shard-02-n1.mongodb-brazil.internal', status: 'Running', version: '12.0.27', type: 'Automation + Monitoring + Backup', ping: '5s ago', cluster: 'sharded-analytics' },
    { host: 'configsvr-01.mongodb-brazil.internal', status: 'Running', version: '12.0.27', type: 'Automation + Monitoring', ping: '5s ago', cluster: 'sharded-analytics' },
    { host: 'stg-mongo-01.mongodb-brazil.internal', status: 'Running', version: '12.0.27', type: 'Automation + Monitoring + Backup', ping: '9s ago', cluster: 'rs-staging' },
    { host: 'stg-mongo-02.mongodb-brazil.internal', status: 'Running', version: '12.0.27', type: 'Automation + Monitoring + Backup', ping: '9s ago', cluster: 'rs-staging' },
    { host: 'dev-mongo.mongodb-brazil.internal', status: 'Running', version: '12.0.27', type: 'Automation + Monitoring', ping: '12s ago', cluster: 'mongo-dev-01' },
  ],
  perf_index_suggestions: [
    { impact: 'high', ns: 'app_db.orders', idx: '{ customerId: 1, createdAt: -1 }', queries: 42, improvement: '~95% faster (12,400 → 8 docs)' },
    { impact: 'high', ns: 'app_db.sessions', idx: '{ userId: 1, expiresAt: 1 }', queries: 38, improvement: '~88% faster (COLLSCAN → IXSCAN)' },
    { impact: 'med', ns: 'analytics.events', idx: '{ eventType: 1, timestamp: -1 }', queries: 21, improvement: '~70% faster' },
    { impact: 'med', ns: 'app_db.products', idx: '{ category: 1, price: 1 }', queries: 15, improvement: '~60% faster (sort in memory removed)' },
  ],
  perf_slow_queries: [
    { ns: 'app_db.orders', shape: '{ customerId: ?, status: ? }', time: '412ms', count: 1240, examined: '12,400', idx: 'COLLSCAN' },
    { ns: 'app_db.sessions', shape: '{ userId: ? }', time: '287ms', count: 980, examined: '8,900', idx: 'COLLSCAN' },
    { ns: 'analytics.events', shape: '{ eventType: ?, timestamp: {$gt:?} }', time: '196ms', count: 540, examined: '45,000', idx: 'timestamp_1' },
    { ns: 'app_db.products', shape: '{ category: ? } sort { price: 1 }', time: '154ms', count: 310, examined: '6,200', idx: 'category_1' },
    { ns: 'app_db.users', shape: '{ email: ? }', time: '98ms', count: 2100, examined: '1', idx: 'email_1 ✓' },
  ],
  ip_access_list: [
    { ip: '10.0.0.0/16', comment: 'Internal VPC', added: 'Jan 01' },
    { ip: '203.0.113.42/32', comment: 'Office VPN gateway', added: 'Jan 05' },
    { ip: '198.51.100.0/24', comment: 'Monitoring subnet', added: 'Jan 10' },
  ],
  audit_events: [
    { ts: '2024-01-15 10:42:18', user: 'admin@mongodb-brazil.com', action: 'createUser', res: 'app_db.app_service', ip: '10.0.1.42', result: 'success' },
    { ts: '2024-01-15 10:38:02', user: 'app_service', action: 'authenticate', res: 'app_db', ip: '10.0.2.15', result: 'success' },
    { ts: '2024-01-15 10:35:51', user: 'unknown', action: 'authenticate', res: 'admin', ip: '203.0.113.99', result: 'fail' },
    { ts: '2024-01-15 10:30:14', user: 'admin@mongodb-brazil.com', action: 'dropCollection', res: 'staging.temp_data', ip: '10.0.1.42', result: 'success' },
    { ts: '2024-01-15 10:22:40', user: 'analytics_ro', action: 'authCheck', res: 'analytics.events (find)', ip: '10.0.2.88', result: 'success' },
    { ts: '2024-01-15 10:18:33', user: 'analytics_ro', action: 'authCheck', res: 'app_db.users (find)', ip: '10.0.2.88', result: 'fail' },
    { ts: '2024-01-15 10:05:11', user: 'backup_user', action: 'authenticate', res: 'admin', ip: '10.0.1.10', result: 'success' },
    { ts: '2024-01-15 09:58:02', user: 'admin@mongodb-brazil.com', action: 'updateRole', res: 'admin.appWriter', ip: '10.0.1.42', result: 'success' },
  ],
  activity: [
    { time: '2024-01-15 10:42', user: 'admin@mongodb-brazil.com', action: 'EDIT', resource: 'rs-prod-01', details: 'Changed oplog size to 10GB' },
    { time: '2024-01-15 09:15', user: 'System', action: 'SNAPSHOT', resource: 'rs-prod-01', details: 'Automated snapshot completed (42GB)' },
    { time: '2024-01-15 08:30', user: 'System', action: 'ALERT RESOLVED', resource: 'rs-prod-01', details: 'High connections alert auto-resolved' },
    { time: '2024-01-15 07:00', user: 'john.doe@mongodb-brazil.com', action: 'CREATE', resource: 'sharded-analytics', details: 'Added shard: shard-03' },
    { time: '2024-01-14 22:10', user: 'System', action: 'UPGRADE', resource: 'rs-staging', details: 'MongoDB upgraded 6.0.11 → 6.0.12' },
    { time: '2024-01-14 18:00', user: 'admin@mongodb-brazil.com', action: 'USER CREATE', resource: 'Security', details: 'New user: app_readonly created' },
    { time: '2024-01-14 14:20', user: 'admin@mongodb-brazil.com', action: 'BACKUP CONFIG', resource: 'rs-prod-01', details: 'Retention policy updated to 30 days' },
  ],
}

let STATE = seed()
const ok = (v) => Promise.resolve(v)
const findCluster = (id) => STATE.clusters.find((c) => c.id === id)
const logActivity = (user, action, resource, details) => STATE.activity.unshift({ time: 'agora', user, action, resource, details })

function series(n, base, noise, mn = 0) {
  let v = base
  return Array.from({ length: n }, () => { v += (Math.random() - 0.5) * noise; return Math.round(Math.max(mn, v) * 10) / 10 })
}
const rand = (a, b) => Math.floor(a + Math.random() * (b - a))
const choice = (arr) => arr[rand(0, arr.length)]

export const MockAPI = {
  meta: () => ok({ org: STATE.org, project: STATE.project }),

  dashboard: () => ok({
    total_clusters: STATE.clusters.length,
    healthy: STATE.clusters.filter((c) => c.status === 'healthy').length,
    warning: STATE.clusters.filter((c) => c.status === 'warning' || c.status === 'critical').length,
    hosts: STATE.clusters.reduce((a, c) => a + c.nodes.length, 0),
    open_alerts: STATE.alerts_open.length,
    snapshots: STATE.snapshots.length + STATE.snapshot_base,
    clusters: STATE.clusters,
    activity: STATE.activity.slice(0, 3),
  }),

  clusters: () => ok(STATE.clusters),
  createCluster: (b) => {
    if (findCluster(b.name)) return Promise.reject({ response: { data: { detail: `Cluster "${b.name}" já existe.` } } })
    const typeKey = { 'Replica Set': 'rs', 'Sharded Cluster': 'sharded', Standalone: 'standalone' }[b.type] || 'rs'
    const members = typeKey === 'standalone' ? 1 : (b.members || 3)
    const nodes = Array.from({ length: members }, (_, i) => ({
      host: `${b.name}-node-0${i + 1}.mongodb-brazil.internal:${b.port || '27017'}`,
      role: typeKey === 'standalone' ? 'Standalone' : (i === 0 ? 'PRIMARY' : 'SECONDARY'),
      version: b.version || '7.0.5', status: 'green', uptime: 'just now', conn: 0, disk: 5, lag: i === 0 ? '—' : '0.0s',
    }))
    const cluster = { id: b.name, type: typeKey, name: b.name, version: b.version || '7.0.5', status: 'healthy', nodes }
    STATE.clusters.push(cluster)
    logActivity('admin@mongodb-brazil.com', 'CREATE', b.name, `Provisioned ${b.type} with ${members} node(s)`)
    return ok(cluster)
  },
  deleteCluster: (id) => { const c = findCluster(id); if (c) STATE.clusters.splice(STATE.clusters.indexOf(c), 1); logActivity('admin@mongodb-brazil.com', 'TERMINATE', id, 'Cluster terminated'); return ok({ ok: true }) },
  editCluster: (id, b) => { const c = findCluster(id); if (c && b.version) { c.version = b.version; c.nodes.forEach((n) => (n.version = b.version)) } return ok(c) },
  addNode: (id, b) => { const c = findCluster(id); const host = b.host || `${c.name}-node-0${c.nodes.length + 1}.mongodb-brazil.internal:27017`; c.nodes.push({ host, role: 'SECONDARY', version: c.version, status: 'green', uptime: 'just now', conn: 0, disk: 3, lag: '0.0s' }); return ok(c) },
  stepDown: (id, idx) => {
    const c = findCluster(id)
    const oldP = c.nodes.find((n) => n.role === 'PRIMARY')
    const newP = c.nodes.find((n, i) => i !== idx && n.role === 'SECONDARY')
    if (oldP) oldP.role = 'SECONDARY'; if (newP) newP.role = 'PRIMARY'
    return ok({ new_primary: newP ? newP.host : null, cluster: c })
  },
  upgradeCluster: (id, b) => { const c = findCluster(id); c.version = b.target_version; c.nodes.forEach((n) => (n.version = b.target_version)); logActivity('System', 'UPGRADE', id, `Rolling upgrade to ${b.target_version}`); return ok(c) },

  automation: () => ok({ agents_active: STATE.agents.length, pending: STATE.pending_changes, history: STATE.automation_history }),
  applyPending: (pid) => {
    const pc = STATE.pending_changes.find((p) => p.id === pid)
    if (pc) {
      STATE.pending_changes.splice(STATE.pending_changes.indexOf(pc), 1)
      STATE.automation_history.unshift({ time: 'agora', cluster: pc.cluster, change: pc.desc, status: 'success', duration: `${rand(2, 9)}m ${rand(0, 59)}s`, by: 'admin' })
    }
    return ok({ ok: true, pending: STATE.pending_changes })
  },
  discardPending: (pid) => { const pc = STATE.pending_changes.find((p) => p.id === pid); if (pc) STATE.pending_changes.splice(STATE.pending_changes.indexOf(pc), 1); return ok({ ok: true, pending: STATE.pending_changes }) },
  agents: () => ok({ agents: STATE.agents, version: '12.0.27', latest: '12.0.28' }),
  upgradeAgents: () => { STATE.agents.forEach((a) => (a.version = '12.0.28')); return ok({ ok: true }) },

  metrics: (id) => {
    const c = findCluster(id); const n = 24
    const cpu = c.nodes.map((node) => ({ label: node.host.split(':')[0].split('.')[0], data: series(n, 35 + Math.random() * 25, 12) }))
    const secs = c.nodes.filter((node) => /SECONDARY/i.test(node.role))
    const lag = secs.map((s) => ({ label: s.host.split(':')[0].split('.')[0], data: series(n, 0.3, 0.4) }))
    return ok({
      cluster: c.name, node_count: c.nodes.length, cpu,
      memory: { resident: series(n, 12, 1.5), virtual: series(n, 24, 2) },
      ops: { query: series(n, 1200, 200), insert: series(n, 380, 80), update: series(n, 140, 40), delete: series(n, 20, 8) },
      connections: { current: series(n, 340, 40), available: series(n, 800, 20) },
      iops: { read: series(n, 620, 120), write: series(n, 310, 80) },
      network: { in: series(n, 12, 3), out: series(n, 8, 2) },
      lag, cache: { used: series(n, 3.2, 0.3), dirty: series(n, 0.4, 0.15) },
    })
  },
  realtime: () => {
    const ns = ['app_db.orders', 'app_db.sessions', 'analytics.events', 'app_db.products', 'app_db.users']
    const ops = ['query', 'insert', 'update', 'getmore', 'command', 'aggregate']
    return ok({
      ops_per_sec: rand(1500, 2200), connections: rand(320, 380),
      net_in: Math.round((10 + Math.random() * 5) * 10) / 10, net_out: Math.round((6 + Math.random() * 4) * 10) / 10,
      docs_per_sec: Math.round((20 + Math.random() * 10) * 10) / 10,
      in_progress: Array.from({ length: rand(2, 5) }, () => ({ opid: rand(10000, 99999), op: choice(ops), ns: choice(ns), secs: Math.round(Math.random() * 2 * 100) / 100 })),
      hottest: ns.map((x) => ({ ns: x, ops: rand(50, 600) })).sort((a, b) => b.ops - a.ops),
    })
  },
  perfAdvisor: () => ok({ index_suggestions: STATE.perf_index_suggestions, slow_queries: STATE.perf_slow_queries, slow_count: 127, avg_query_ms: 8.4, collections_scanned: 42 }),
  createIndex: (idx) => { const removed = STATE.perf_index_suggestions.splice(idx, 1)[0]; return ok({ ok: true, created: removed, remaining: STATE.perf_index_suggestions }) },

  backup: () => ok({ protected: STATE.clusters.filter((c) => c.type !== 'standalone').length, total_snapshots: STATE.snapshots.length + STATE.snapshot_base, snapshots: STATE.snapshots }),
  takeSnapshot: (cluster) => { const lastNum = STATE.snapshots.length ? parseInt(STATE.snapshots[0].id.split('-')[1]) : 142; const snap = { id: `snap-${String(lastNum + 1).padStart(5, '0')}`, cluster, type: 'Manual', created: 'agora', size: '42 GB', expires: '2024-02-15', status: 'ready' }; STATE.snapshots.unshift(snap); return ok(snap) },
  deleteSnapshot: (sid) => { const s = STATE.snapshots.find((x) => x.id === sid); if (s) STATE.snapshots.splice(STATE.snapshots.indexOf(s), 1); return ok({ ok: true }) },

  alerts: () => ok({ open: STATE.alerts_open, closed_count: STATE.alerts_closed_count, configs: STATE.alert_configs }),
  resolveAlert: (aid) => { const a = STATE.alerts_open.find((x) => x.id === aid); if (a) { STATE.alerts_open.splice(STATE.alerts_open.indexOf(a), 1); STATE.alerts_closed_count++ } return ok({ ok: true, open: STATE.alerts_open, closed_count: STATE.alerts_closed_count }) },
  addAlertConfig: (b) => { const cfg = { cond: b.cond, target: b.target, thresh: b.thresh, notify: b.notify || 'Email', on: true }; STATE.alert_configs.unshift(cfg); return ok(cfg) },
  deleteAlertConfig: (idx) => { STATE.alert_configs.splice(idx, 1); return ok({ ok: true }) },

  users: () => ok(STATE.users),
  addUser: (b) => { const u = { name: b.name, auth: b.auth, roles: [b.role], db: b.role.includes('@') ? b.role.split('@')[1] : 'admin', created: 'just now', status: 'active' }; STATE.users.unshift(u); logActivity('admin@mongodb-brazil.com', 'USER CREATE', 'Security', `New user: ${b.name}`); return ok(u) },
  deleteUser: (name) => { const u = STATE.users.find((x) => x.name === name); if (u) STATE.users.splice(STATE.users.indexOf(u), 1); return ok({ ok: true }) },
  roles: () => ok(STATE.roles),
  addRole: (b) => { const r = { name: b.name, priv: b.priv || 'find', inherits: b.inherits || '(none)', users: 0 }; STATE.roles.unshift(r); return ok(r) },
  deleteRole: (idx) => { STATE.roles.splice(idx, 1); return ok({ ok: true }) },
  ips: () => ok(STATE.ip_access_list),
  addIp: (b) => { const e = { ip: b.ip, comment: b.comment || '—', added: 'just now' }; STATE.ip_access_list.push(e); return ok(e) },
  deleteIp: (idx) => { STATE.ip_access_list.splice(idx, 1); return ok({ ok: true }) },
  audit: () => ok(STATE.audit_events),

  activity: () => ok(STATE.activity),
  reset: () => { STATE = seed(); return ok({ ok: true }) },
}
