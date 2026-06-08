import { useEffect, useState } from 'react'
import Card from '@leafygreen-ui/card'
import Badge from '@leafygreen-ui/badge'
import Button from '@leafygreen-ui/button'
import Icon from '@leafygreen-ui/icon'
import { Subtitle } from '@leafygreen-ui/typography'
import { spacing } from '@leafygreen-ui/tokens'
import { PageHeader, StatCard, Grid, DataTable, Loading, EmptyState } from '../components/ui'
import { API } from '../api/client'

export default function Automation({ toast, refreshCounts }) {
  const [data, setData] = useState(null)
  const reload = () => API.automation().then(setData).then(() => refreshCounts?.())
  useEffect(() => { reload() }, [])
  if (!data) return <Loading />

  const apply = async (pid, desc) => {
    try { await API.applyPending(pid); toast('Mudança aplicada', desc, 'success'); reload() }
    catch (e) { toast('Erro', String(e), 'warning') }
  }
  const discard = async (pid) => {
    try { await API.discardPending(pid); toast('Mudança descartada', '', 'warning'); reload() }
    catch (e) { toast('Erro', String(e), 'warning') }
  }

  const pendCols = [
    { header: 'Cluster', render: (r) => <b>{r.cluster}</b> },
    { header: 'Change Type', render: (r) => <Badge variant={r.type === 'Version Upgrade' ? 'blue' : 'yellow'}>{r.type}</Badge> },
    { header: 'Description', key: 'desc' },
    { header: 'Requested By', key: 'by' },
    { header: 'Time', key: 'time' },
    { header: 'Actions', render: (r) => (
      <div style={{ display: 'flex', gap: 6 }}>
        <Button size="xsmall" variant="primary" onClick={() => apply(r.id, r.desc)}>Apply</Button>
        <Button size="xsmall" variant="dangerOutline" onClick={() => discard(r.id)}>Discard</Button>
      </div>
    ) },
  ]
  const histCols = [
    { header: 'Time', key: 'time' }, { header: 'Cluster', key: 'cluster' }, { header: 'Change', key: 'change' },
    { header: 'Status', render: (r) => <Badge variant={r.status === 'success' ? 'green' : 'red'}>{r.status === 'success' ? '✓ Success' : '✗ Failed'}</Badge> },
    { header: 'Duration', key: 'duration' }, { header: 'By', key: 'by' },
  ]

  return (
    <div>
      <PageHeader title="Automation" subtitle="Manage deployment configurations and rolling changes" />
      <Grid cols={3} style={{ marginBottom: spacing[600] }}>
        <StatCard label="Automation Agents" value={data.agents_active} sub={<Badge variant="green">{data.agents_active} Active</Badge>} />
        <StatCard label="Pending Changes" value={data.pending.length} sub={data.pending.length ? <Badge variant="yellow">Awaiting Review</Badge> : <Badge variant="green">Tudo aplicado</Badge>} />
        <StatCard label="Last Deployment" value={data.history[0]?.time || '—'} sub={data.history[0]?.cluster} />
      </Grid>

      <Card style={{ padding: 0, overflow: 'hidden', marginBottom: spacing[600] }}>
        <div style={{ padding: spacing[400], borderBottom: `1px solid #e8edeb` }}><Subtitle>⏳ Pending Changes (requires review)</Subtitle></div>
        <DataTable columns={pendCols} rows={data.pending}
          empty={<EmptyState title="Nenhuma mudança pendente">Todas as alterações foram aplicadas ou descartadas.</EmptyState>} />
      </Card>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: spacing[400], borderBottom: `1px solid #e8edeb` }}><Subtitle>Automation History</Subtitle></div>
        <DataTable columns={histCols} rows={data.history} />
      </Card>
    </div>
  )
}
