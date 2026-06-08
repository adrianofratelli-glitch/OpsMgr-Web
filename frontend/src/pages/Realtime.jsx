import { useEffect, useState, useRef } from 'react'
import Card from '@leafygreen-ui/card'
import Badge from '@leafygreen-ui/badge'
import Button from '@leafygreen-ui/button'
import { Subtitle } from '@leafygreen-ui/typography'
import { spacing } from '@leafygreen-ui/tokens'
import { palette } from '@leafygreen-ui/palette'
import { PageHeader, StatCard, Grid, DataTable, Loading } from '../components/ui'
import { API } from '../api/client'

function Bar({ pct }) {
  return (
    <span style={{ width: 100, height: 6, borderRadius: 3, background: palette.gray.light2, display: 'inline-block', overflow: 'hidden' }}>
      <span style={{ display: 'block', height: '100%', width: `${pct}%`, background: palette.green.base }} />
    </span>
  )
}

export default function Realtime({ toast }) {
  const [clusters, setClusters] = useState([])
  const [cid, setCid] = useState(null)
  const [rt, setRt] = useState(null)
  const [paused, setPaused] = useState(false)
  const timer = useRef(null)

  useEffect(() => { API.clusters().then((cs) => { setClusters(cs); setCid(cs[0]?.id) }) }, [])
  useEffect(() => {
    if (!cid) return
    const tick = () => API.realtime(cid).then(setRt).catch(() => {})
    tick()
    timer.current = setInterval(() => { if (!paused) tick() }, 1000)
    return () => clearInterval(timer.current)
  }, [cid, paused])

  if (!rt) return <Loading />

  const maxHot = Math.max(...rt.hottest.map((h) => h.ops))
  const ipCols = [
    { header: 'OpId', render: (r) => <code>{r.opid}</code> },
    { header: 'Operation', render: (r) => <Badge variant={r.op === 'query' ? 'blue' : r.op === 'insert' ? 'green' : 'lightgray'}>{r.op}</Badge> },
    { header: 'Namespace', render: (r) => <code style={{ fontSize: 12 }}>{r.ns}</code> },
    { header: 'Running', render: (r) => `${r.secs}s` },
    { header: 'Actions', render: () => <Button size="xsmall" onClick={() => toast('Operation killed', 'db.killOp() enviado.', 'warning')}>Kill</Button> },
  ]
  const hotCols = [
    { header: 'Namespace', render: (r) => <code>{r.ns}</code> },
    { header: 'Ops/s', render: (r) => <b>{r.ops}</b> },
    { header: 'Activity', render: (r) => <Bar pct={Math.round((r.ops / maxHot) * 100)} /> },
  ]

  return (
    <div>
      <PageHeader title="Real-Time Performance Panel" subtitle="Live operations · updates every second"
        actions={[<Button key="p" leftGlyph={undefined} onClick={() => setPaused((p) => !p)}>{paused ? '▶ Resume' : '⏸ Pause'}</Button>]} />
      <Grid cols={4} style={{ marginBottom: spacing[600] }}>
        <StatCard label="Operations / sec" value={rt.ops_per_sec.toLocaleString()} />
        <StatCard label="Active Connections" value={rt.connections} sub="of 1,000 max" />
        <StatCard label="Network In/Out" value={`${rt.net_in} / ${rt.net_out}`} sub="MB/s" />
        <StatCard label="Documents / sec" value={`${rt.docs_per_sec}k`} sub="read + written" />
      </Grid>
      <Grid cols={2} gap={spacing[400]}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: spacing[400], borderBottom: `1px solid #e8edeb` }}><Subtitle>⚡ Operations In Progress</Subtitle></div>
          <DataTable columns={ipCols} rows={rt.in_progress} />
        </Card>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: spacing[400], borderBottom: `1px solid #e8edeb` }}><Subtitle>🔥 Hottest Collections (live)</Subtitle></div>
          <DataTable columns={hotCols} rows={rt.hottest} />
        </Card>
      </Grid>
    </div>
  )
}
