import { useEffect, useState } from 'react'
import Card from '@leafygreen-ui/card'
import Badge from '@leafygreen-ui/badge'
import Button from '@leafygreen-ui/button'
import Icon from '@leafygreen-ui/icon'
import TextInput from '@leafygreen-ui/text-input'
import { spacing } from '@leafygreen-ui/tokens'
import { PageHeader, DataTable, Loading } from '../components/ui'
import { API } from '../api/client'

export default function Audit({ toast }) {
  const [events, setEvents] = useState(null)
  const [q, setQ] = useState('')
  useEffect(() => { API.audit().then(setEvents) }, [])
  if (!events) return <Loading />

  const filtered = events.filter((e) => (e.user + e.action + e.res + e.ip).toLowerCase().includes(q.toLowerCase()))
  const cols = [
    { header: 'Timestamp', render: (r) => <code style={{ fontSize: 12 }}>{r.ts}</code> },
    { header: 'User', key: 'user' },
    { header: 'Action', render: (r) => <Badge variant="blue">{r.action}</Badge> },
    { header: 'Resource', render: (r) => <code style={{ fontSize: 12 }}>{r.res}</code> },
    { header: 'Source IP', render: (r) => <code>{r.ip}</code> },
    { header: 'Result', render: (r) => r.result === 'success' ? <Badge variant="green">✓ Success</Badge> : <Badge variant="red">✗ Denied</Badge> },
  ]

  return (
    <div>
      <PageHeader title="Audit Log" subtitle="Security & data access events"
        actions={[<Button key="e" leftGlyph={<Icon glyph="Export" />} onClick={() => toast('Export', 'Audit log (CSV) sendo preparado.', 'note')}>Export CSV</Button>]} />
      <div style={{ marginBottom: spacing[400], maxWidth: 320 }}>
        <TextInput aria-label="Filtrar" placeholder="🔍 Filtrar por user, action, IP…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <Card style={{ padding: 0, overflow: 'hidden' }}><DataTable columns={cols} rows={filtered} /></Card>
    </div>
  )
}
