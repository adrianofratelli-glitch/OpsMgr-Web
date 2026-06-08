import { useEffect, useState } from 'react'
import Banner from '@leafygreen-ui/banner'
import Card from '@leafygreen-ui/card'
import Badge from '@leafygreen-ui/badge'
import Button from '@leafygreen-ui/button'
import Icon from '@leafygreen-ui/icon'
import { Body, Subtitle, Description } from '@leafygreen-ui/typography'
import { palette } from '@leafygreen-ui/palette'
import { spacing } from '@leafygreen-ui/tokens'
import { PageHeader, StatCard, Grid, Loading } from '../components/ui'
import { API } from '../api/client'

const TYPE_BADGE = {
  rs: { variant: 'blue', label: 'Replica Set' },
  sharded: { variant: 'green', label: 'Sharded' },
  standalone: { variant: 'yellow', label: 'Standalone' },
}
const STATUS_BADGE = {
  healthy: { variant: 'green', label: '● Healthy' },
  warning: { variant: 'yellow', label: '● Warning' },
  critical: { variant: 'red', label: '● Critical' },
}
const NODE_DOT = { green: palette.green.base, yellow: palette.yellow.base, red: palette.red.base }

function ClusterCard({ c }) {
  const tb = TYPE_BADGE[c.type] || TYPE_BADGE.rs
  const sb = STATUS_BADGE[c.status] || STATUS_BADGE.healthy
  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: `${spacing[300]}px ${spacing[400]}px`, borderBottom: `1px solid ${palette.gray.light2}` }}>
        <Badge variant={tb.variant}>{tb.label}</Badge>
        <Subtitle style={{ fontSize: 15 }}>{c.name}</Subtitle>
        <Badge variant={sb.variant}>{sb.label}</Badge>
      </div>
      <div style={{ padding: `4px ${spacing[400]}px ${spacing[300]}px` }}>
        {c.nodes.slice(0, 3).map((n) => (
          <div key={n.host} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${palette.gray.light3}`, fontSize: 13 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: NODE_DOT[n.status], flexShrink: 0 }} />
            <span style={{ flex: 1, fontWeight: 500 }}>{n.host}</span>
            <Description style={{ width: 110 }}>{n.role}</Description>
            <Description style={{ width: 60 }}>{n.conn} conn</Description>
          </div>
        ))}
        {c.nodes.length > 3 && (
          <Description style={{ padding: '6px 0' }}>+{c.nodes.length - 3} more nodes</Description>
        )}
      </div>
    </Card>
  )
}

export default function Dashboard({ navigate }) {
  const [data, setData] = useState(null)

  useEffect(() => { API.dashboard().then(setData).catch(() => setData(false)) }, [])

  if (data === null) return <Loading />
  if (data === false) return <Banner variant="danger">Não foi possível conectar ao backend. Rode o servidor FastAPI (porta 8077).</Banner>

  const crit = data.open_alerts > 0
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Project: Production · Last refreshed just now"
        actions={[
          <Button key="r" leftGlyph={<Icon glyph="Refresh" />} onClick={() => API.dashboard().then(setData)}>Refresh</Button>,
          <Button key="a" variant="primary" leftGlyph={<Icon glyph="Plus" />} onClick={() => navigate('deployments')}>Add Deployment</Button>,
        ]}
      />

      {crit && (
        <Banner variant="danger" style={{ marginBottom: spacing[400] }}>
          <b>CRITICAL:</b> Disk utilization above 90% on rs-prod-01 / mongo-node-02 —{' '}
          <a onClick={() => navigate('alerts')} style={{ color: palette.blue.base, cursor: 'pointer', fontWeight: 600 }}>View Alert</a>
        </Banner>
      )}

      <Grid cols={4} style={{ marginBottom: spacing[600] }}>
        <StatCard label="Total Clusters" value={data.total_clusters}
          sub={<><Badge variant="green">{data.healthy} Healthy</Badge>{data.warning ? <> <Badge variant="red">{data.warning} Warning</Badge></> : null}</>} />
        <StatCard label="Monitored Hosts" value={data.hosts} sub={<Badge variant="green">Online</Badge>} />
        <StatCard label="Active Alerts" value={data.open_alerts} color={data.open_alerts ? palette.red.base : undefined}
          sub={<Badge variant="red">Needs attention</Badge>} />
        <StatCard label="Backup Snapshots" value={data.snapshots} sub={<Badge variant="green">All up-to-date</Badge>} />
      </Grid>

      <Grid cols={2} style={{ marginBottom: spacing[600] }}>
        {data.clusters.map((c) => <ClusterCard key={c.id} c={c} />)}
      </Grid>

      <Card>
        <Subtitle style={{ marginBottom: spacing[300] }}>Recent Activity</Subtitle>
        {data.activity.map((a, i) => (
          <div key={i} style={{ padding: '7px 0', borderBottom: i < data.activity.length - 1 ? `1px solid ${palette.gray.light2}` : 'none', fontSize: 13 }}>
            <Description style={{ display: 'inline' }}>{a.time}</Description>&nbsp;&nbsp;
            <b>{a.user}</b> — {a.details}
          </div>
        ))}
      </Card>
    </div>
  )
}
