import { useEffect, useState } from 'react'
import Card from '@leafygreen-ui/card'
import Badge from '@leafygreen-ui/badge'
import Button from '@leafygreen-ui/button'
import Icon from '@leafygreen-ui/icon'
import { Subtitle } from '@leafygreen-ui/typography'
import { spacing } from '@leafygreen-ui/tokens'
import { PageHeader, StatCard, Grid, DataTable, Loading } from '../components/ui'
import { API } from '../api/client'

export default function Agents({ toast }) {
  const [data, setData] = useState(null)
  const reload = () => API.agents().then(setData)
  useEffect(() => { reload() }, [])
  if (!data) return <Loading />

  const upgradeAll = async () => {
    try { await API.upgradeAgents(); toast('Agents atualizados', 'Todos os agents agora rodam v12.0.28.', 'success'); reload() }
    catch (e) { toast('Erro', String(e), 'warning') }
  }

  const cols = [
    { header: 'Host', render: (r) => <b>{r.host}</b> },
    { header: 'Status', render: (r) => <Badge variant="green">● {r.status}</Badge> },
    { header: 'Version', key: 'version' },
    { header: 'Type', render: (r) => <span style={{ fontSize: 12, color: '#888' }}>{r.type}</span> },
    { header: 'Last Ping', key: 'ping' },
    { header: 'Cluster', key: 'cluster' },
    { header: 'Actions', render: (r) => <Button size="xsmall" onClick={() => toast('Logs', `Agent logs de ${r.host}`, 'note')}>Logs</Button> },
  ]

  return (
    <div>
      <PageHeader title="Automation Agents" subtitle={`${data.agents.length} agents registrados`}
        actions={[
          <Button key="d" leftGlyph={<Icon glyph="Download" />} onClick={() => toast('Download', 'Agent installer', 'note')}>Download Agent</Button>,
          <Button key="u" variant="primary" leftGlyph={<Icon glyph="ArrowUp" />} onClick={upgradeAll}>Upgrade All</Button>,
        ]} />
      <Grid cols={4} style={{ marginBottom: spacing[600] }}>
        <StatCard label="Total Agents" value={data.agents.length} />
        <StatCard label="Running" value={data.agents.length} />
        <StatCard label="Agent Version" value={data.version} />
        <StatCard label="Latest Available" value={data.latest} sub={<Badge variant="yellow">Update available</Badge>} />
      </Grid>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: spacing[400], borderBottom: `1px solid #e8edeb` }}><Subtitle>Agent List</Subtitle></div>
        <DataTable columns={cols} rows={data.agents} />
      </Card>
    </div>
  )
}
