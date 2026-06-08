import { useEffect, useState } from 'react'
import Card from '@leafygreen-ui/card'
import Badge from '@leafygreen-ui/badge'
import Button from '@leafygreen-ui/button'
import Icon from '@leafygreen-ui/icon'
import { Subtitle, Description } from '@leafygreen-ui/typography'
import { spacing } from '@leafygreen-ui/tokens'
import { palette } from '@leafygreen-ui/palette'
import { PageHeader, StatCard, Grid, DataTable, Loading } from '../components/ui'
import { API } from '../api/client'

const IMPACT = { high: ['red', 'High'], med: ['yellow', 'Medium'], low: ['blue', 'Low'] }

export default function PerfAdvisor({ toast, refreshCounts }) {
  const [data, setData] = useState(null)
  const reload = () => API.perfAdvisor().then(setData).then(() => refreshCounts?.())
  useEffect(() => { reload() }, [])
  if (!data) return <Loading />

  const createIdx = async (i, s) => {
    try { await API.createIndex(i); toast('Index criado!', `${s.idx} em ${s.ns}`, 'success'); reload() }
    catch (e) { toast('Erro', String(e), 'warning') }
  }

  const idxCols = [
    { header: 'Impact', render: (r) => { const [v, l] = IMPACT[r.impact] || IMPACT.low; return <Badge variant={v}>{l}</Badge> } },
    { header: 'Namespace', render: (r) => <code>{r.ns}</code> },
    { header: 'Suggested Index', render: (r) => <code style={{ color: palette.green.dark1 }}>{r.idx}</code> },
    { header: 'Queries', render: (r) => `${r.queries} queries` },
    { header: 'Est. Improvement', render: (r) => <span style={{ fontSize: 12, color: palette.green.dark1 }}>{r.improvement}</span> },
    { header: 'Actions', render: (r, i) => <Button size="xsmall" variant="primary" onClick={() => createIdx(i, r)}>Create Index</Button> },
  ]
  const slowCols = [
    { header: 'Namespace', render: (r) => <code>{r.ns}</code> },
    { header: 'Query Shape', render: (r) => <code style={{ fontSize: 12 }}>{r.shape}</code> },
    { header: 'Avg Time', render: (r) => <b style={{ color: parseInt(r.time) > 200 ? palette.red.base : parseInt(r.time) > 100 ? palette.yellow.dark2 : palette.gray.dark1 }}>{r.time}</b> },
    { header: 'Count', key: 'count' },
    { header: 'Docs Examined', key: 'examined' },
    { header: 'Index Used', render: (r) => <Badge variant={r.idx.includes('✓') ? 'green' : r.idx === 'COLLSCAN' ? 'red' : 'yellow'}>{r.idx}</Badge> },
  ]

  return (
    <div>
      <PageHeader title="Performance Advisor" subtitle="Automatic index suggestions & slow query analysis"
        actions={[<Button key="r" leftGlyph={<Icon glyph="Refresh" />} onClick={reload}>Re-scan</Button>]} />
      <Grid cols={4} style={{ marginBottom: spacing[600] }}>
        <StatCard label="Index Suggestions" value={data.index_suggestions.length} color={palette.yellow.dark2} sub={<Description>High impact opportunities</Description>} />
        <StatCard label="Slow Queries (24h)" value={data.slow_count} color={palette.red.base} sub={<Description>&gt; 100ms execution</Description>} />
        <StatCard label="Avg Query Time" value={`${data.avg_query_ms}ms`} sub={<Badge variant="green">↓ 12% vs ontem</Badge>} />
        <StatCard label="Collections Scanned" value={data.collections_scanned} sub={<Description>across all databases</Description>} />
      </Grid>
      <Card style={{ padding: 0, overflow: 'hidden', marginBottom: spacing[600] }}>
        <div style={{ padding: spacing[400], borderBottom: `1px solid #e8edeb` }}><Subtitle>💡 Suggested Indexes</Subtitle></div>
        <DataTable columns={idxCols} rows={data.index_suggestions} />
      </Card>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: spacing[400], borderBottom: `1px solid #e8edeb` }}><Subtitle>🐌 Slowest Queries</Subtitle></div>
        <DataTable columns={slowCols} rows={data.slow_queries} />
      </Card>
    </div>
  )
}
