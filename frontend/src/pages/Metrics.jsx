import { useEffect, useState } from 'react'
import Card from '@leafygreen-ui/card'
import Button from '@leafygreen-ui/button'
import Icon from '@leafygreen-ui/icon'
import { Select, Option } from '@leafygreen-ui/select'
import { Subtitle, Description } from '@leafygreen-ui/typography'
import { spacing } from '@leafygreen-ui/tokens'
import { palette } from '@leafygreen-ui/palette'
import { PageHeader, Grid, Loading } from '../components/ui'
import LineChart from '../components/LineChart'
import { API } from '../api/client'

function ChartCard({ title, hint, children }) {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: spacing[200] }}>
        <Subtitle style={{ fontSize: 14 }}>{title}</Subtitle>
        {hint && <Description style={{ marginLeft: 'auto' }}>{hint}</Description>}
      </div>
      {children}
    </Card>
  )
}

export default function Metrics() {
  const [clusters, setClusters] = useState([])
  const [cid, setCid] = useState(null)
  const [m, setM] = useState(null)

  useEffect(() => { API.clusters().then((cs) => { setClusters(cs); setCid(cs[0]?.id) }) }, [])
  useEffect(() => { if (cid) API.metrics(cid).then(setM) }, [cid])

  if (!m) return <Loading />

  return (
    <div>
      <PageHeader title="Metrics" subtitle={`Real-time monitoring · ${m.cluster} (${m.node_count} node${m.node_count > 1 ? 's' : ''})`}
        actions={[
          <Select key="c" aria-label="Cluster" value={cid} onChange={setCid} allowDeselect={false} size="small">
            {clusters.map((c) => <Option key={c.id} value={c.id}>{c.name}</Option>)}
          </Select>,
          <Button key="r" leftGlyph={<Icon glyph="Refresh" />} onClick={() => API.metrics(cid).then(setM)}>Refresh</Button>,
        ]} />
      <Grid cols={2} gap={spacing[400]}>
        <ChartCard title="CPU Utilization (%)" hint="per node">
          <LineChart yMax={100} series={m.cpu.map((s, i) => ({ label: s.label, data: s.data, fill: i === 0 }))} />
        </ChartCard>
        <ChartCard title="Memory Usage (GB)" hint="resident · virtual">
          <LineChart yMax={32} series={[{ label: 'Resident', data: m.memory.resident, fill: true }, { label: 'Virtual', data: m.memory.virtual }]} />
        </ChartCard>
        <ChartCard title="Operations / sec">
          <LineChart series={[{ label: 'query', data: m.ops.query }, { label: 'insert', data: m.ops.insert }, { label: 'update', data: m.ops.update }, { label: 'delete', data: m.ops.delete }]} />
        </ChartCard>
        <ChartCard title="Connections" hint="current · available">
          <LineChart series={[{ label: 'current', data: m.connections.current, fill: true }, { label: 'available', data: m.connections.available }]} />
        </ChartCard>
        <ChartCard title="Disk IOPS" hint="read · write">
          <LineChart series={[{ label: 'read', data: m.iops.read, fill: true }, { label: 'write', data: m.iops.write }]} />
        </ChartCard>
        <ChartCard title="Network I/O (MB/s)" hint="in · out">
          <LineChart series={[{ label: 'in', data: m.network.in, fill: true }, { label: 'out', data: m.network.out }]} />
        </ChartCard>
        <ChartCard title="Replication Lag (sec)" hint="secondaries">
          <LineChart series={m.lag.length ? m.lag.map((s, i) => ({ label: s.label, data: s.data, fill: i === 0 })) : [{ label: 'single node', data: [0, 0, 0], color: palette.gray.base }]} />
        </ChartCard>
        <ChartCard title="WiredTiger Cache (GB)" hint="used · dirty">
          <LineChart yMax={4} series={[{ label: 'used', data: m.cache.used, fill: true }, { label: 'dirty', data: m.cache.dirty }]} />
        </ChartCard>
      </Grid>
    </div>
  )
}
