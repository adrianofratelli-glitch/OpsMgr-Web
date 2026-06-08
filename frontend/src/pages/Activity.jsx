import { useEffect, useState } from 'react'
import Card from '@leafygreen-ui/card'
import Badge from '@leafygreen-ui/badge'
import Button from '@leafygreen-ui/button'
import Icon from '@leafygreen-ui/icon'
import { spacing } from '@leafygreen-ui/tokens'
import { PageHeader, DataTable, Loading } from '../components/ui'
import { API } from '../api/client'

export default function Activity({ toast }) {
  const [events, setEvents] = useState(null)
  useEffect(() => { API.activity().then(setEvents) }, [])
  if (!events) return <Loading />

  const cols = [
    { header: 'Time', key: 'time' },
    { header: 'User', key: 'user' },
    { header: 'Action', render: (r) => <Badge variant="blue">{r.action}</Badge> },
    { header: 'Resource', render: (r) => <b>{r.resource}</b> },
    { header: 'Details', key: 'details' },
  ]
  return (
    <div>
      <PageHeader title="Activity Feed" subtitle="All project events"
        actions={[<Button key="e" leftGlyph={<Icon glyph="Export" />} onClick={() => toast('Export', 'Exportando…', 'note')}>Export</Button>]} />
      <Card style={{ padding: 0, overflow: 'hidden' }}><DataTable columns={cols} rows={events} /></Card>
    </div>
  )
}
