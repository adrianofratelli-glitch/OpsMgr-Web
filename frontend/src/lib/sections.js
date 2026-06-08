// Definição das seções (dirige a SideNav e o roteamento por estado)
export const SECTIONS = [
  { group: 'Overview', items: [
    { id: 'dashboard', label: 'Dashboard', glyph: 'Dashboard' },
    { id: 'activity', label: 'Activity Feed', glyph: 'ActivityFeed' },
  ]},
  { group: 'Deployments', items: [
    { id: 'deployments', label: 'All Clusters', glyph: 'Database' },
    { id: 'automation', label: 'Automation', glyph: 'Wrench' },
  ]},
  { group: 'Monitoring', items: [
    { id: 'metrics', label: 'Metrics', glyph: 'Charts' },
    { id: 'perf-advisor', label: 'Performance Advisor', glyph: 'Bulb' },
    { id: 'realtime', label: 'Real-Time', glyph: 'Clock' },
    { id: 'alerts', label: 'Alerts', glyph: 'Bell' },
  ]},
  { group: 'Data Protection', items: [
    { id: 'backup', label: 'Backup', glyph: 'Upload' },
    { id: 'restore', label: 'Restore', glyph: 'Download' },
  ]},
  { group: 'Security', items: [
    { id: 'users', label: 'Database Users', glyph: 'Person' },
    { id: 'roles', label: 'Custom Roles', glyph: 'Shield' },
    { id: 'auth', label: 'Authentication', glyph: 'Lock' },
    { id: 'audit', label: 'Audit Log', glyph: 'File' },
  ]},
  { group: 'Administration', items: [
    { id: 'agents', label: 'Agents', glyph: 'Laptop' },
    { id: 'settings', label: 'Project Settings', glyph: 'Settings' },
  ]},
]

export const ALL_SECTIONS = SECTIONS.flatMap((g) => g.items)
