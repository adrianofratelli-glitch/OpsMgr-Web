import { useState } from 'react'
import Card from '@leafygreen-ui/card'
import Badge from '@leafygreen-ui/badge'
import Button from '@leafygreen-ui/button'
import Banner from '@leafygreen-ui/banner'
import TextInput from '@leafygreen-ui/text-input'
import { Select, Option } from '@leafygreen-ui/select'
import { Subtitle, Body } from '@leafygreen-ui/typography'
import { spacing } from '@leafygreen-ui/tokens'
import { palette } from '@leafygreen-ui/palette'
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider'
import { PageHeader, Grid, DataTable } from '../components/ui'

const JOBS = [
  { id: 'rst-00142', cluster: 'rs-prod-01', type: 'PIT', point: '2024-01-14 09:00:00', target: 'rs-staging', status: 'Completed', started: '2024-01-14 09:12' },
  { id: 'rst-00141', cluster: 'sharded-analytics', type: 'Snapshot', point: '2024-01-13 18:00:00', target: 'Automated', status: 'Completed', started: '2024-01-13 18:45' },
]

export default function Restore({ toast }) {
  const { darkMode } = useDarkMode()
  const [cluster, setCluster] = useState('rs-prod-01')
  const cols = [
    { header: 'Job ID', render: (r) => <code>{r.id}</code> },
    { header: 'Cluster', key: 'cluster' },
    { header: 'Type', render: (r) => <Badge variant={r.type === 'PIT' ? 'blue' : 'lightgray'}>{r.type}</Badge> },
    { header: 'Restore Point', key: 'point' },
    { header: 'Target', key: 'target' },
    { header: 'Status', render: (r) => <Badge variant="green">✓ {r.status}</Badge> },
    { header: 'Started', key: 'started' },
  ]
  return (
    <div>
      <PageHeader title="Restore" subtitle="Point-in-time & snapshot restore" />
      <Card style={{ padding: 0, overflow: 'hidden', marginBottom: spacing[600] }}>
        <div style={{ padding: spacing[400], borderBottom: `1px solid #e8edeb` }}><Subtitle>Restore Jobs</Subtitle></div>
        <DataTable columns={cols} rows={JOBS} />
      </Card>
      <Card>
        <Subtitle style={{ marginBottom: spacing[400] }}>🕐 Point-in-Time Recovery</Subtitle>
        <Grid cols={2} gap={spacing[500]}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[300] }}>
            <Select label="Source Cluster" value={cluster} onChange={setCluster} allowDeselect={false}>
              <Option value="rs-prod-01">rs-prod-01</Option>
              <Option value="sharded-analytics">sharded-analytics</Option>
              <Option value="rs-staging">rs-staging</Option>
            </Select>
            <TextInput label="Restore Point (UTC)" type="datetime-local" value="2024-01-15T09:00" onChange={() => {}} />
            <Select label="Restore Target" value="same" onChange={() => {}} allowDeselect={false}>
              <Option value="same">Restore to same cluster</Option>
              <Option value="staging">Restore to rs-staging</Option>
              <Option value="download">Download as tar.gz</Option>
            </Select>
            <Banner variant="info">Oplog coverage: <b>Jan 13 00:00 → Jan 15 10:42 UTC</b>. Qualquer ponto nessa janela é recuperável.</Banner>
            <Button variant="primary" onClick={() => toast('Restore iniciado', 'Point-in-time recovery em andamento…', 'success')}>Start Point-in-Time Restore</Button>
          </div>
          <div>
            <Body style={{ marginBottom: 10, fontWeight: 600 }}>Oplog Coverage Timeline</Body>
            <div style={{ background: darkMode ? palette.gray.dark3 : palette.gray.light3, borderRadius: 6, padding: 16, height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: palette.gray.base, marginBottom: 6 }}>
                <span>Jan 13</span><span>Jan 14</span><span>Jan 15 (now)</span>
              </div>
              <div style={{ height: 20, background: `linear-gradient(90deg, ${palette.green.base}, ${palette.green.dark1})`, borderRadius: 4 }} />
              <Body style={{ fontSize: 12, color: palette.gray.base, marginTop: 14 }}><b>4 snapshots</b> disponíveis · último 2h atrás · 42 GB</Body>
            </div>
          </div>
        </Grid>
      </Card>
    </div>
  )
}
