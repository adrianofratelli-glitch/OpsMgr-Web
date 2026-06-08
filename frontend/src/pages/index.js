import Dashboard from './Dashboard'
import Deployments from './Deployments'
import Automation from './Automation'
import Agents from './Agents'
import Metrics from './Metrics'
import PerfAdvisor from './PerfAdvisor'
import Realtime from './Realtime'
import Backup from './Backup'
import Restore from './Restore'
import Alerts from './Alerts'
import Users from './Users'
import Roles from './Roles'
import Auth from './Auth'
import Audit from './Audit'
import Activity from './Activity'
import Settings from './Settings'
import Placeholder from './Placeholder'
import { ALL_SECTIONS } from '../lib/sections'

const READY = {
  dashboard: Dashboard,
  deployments: Deployments,
  automation: Automation,
  agents: Agents,
  metrics: Metrics,
  'perf-advisor': PerfAdvisor,
  realtime: Realtime,
  backup: Backup,
  restore: Restore,
  alerts: Alerts,
  users: Users,
  roles: Roles,
  auth: Auth,
  audit: Audit,
  activity: Activity,
  settings: Settings,
}

export const PAGES = Object.fromEntries(
  ALL_SECTIONS.map((s) => {
    const Comp = READY[s.id]
    if (Comp) return [s.id, Comp]
    const P = (props) => Placeholder({ ...props, title: s.label })
    return [s.id, P]
  }),
)
