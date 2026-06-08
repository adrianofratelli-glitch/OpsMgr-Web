import { useEffect, useState } from 'react'
import Card from '@leafygreen-ui/card'
import Badge from '@leafygreen-ui/badge'
import Button from '@leafygreen-ui/button'
import Icon from '@leafygreen-ui/icon'
import { Subtitle, Body, Description } from '@leafygreen-ui/typography'
import ConfirmationModal from '@leafygreen-ui/confirmation-modal'
import { palette } from '@leafygreen-ui/palette'
import { spacing } from '@leafygreen-ui/tokens'
import { PageHeader, DataTable, MetaRow, Loading } from '../components/ui'
import NewDeploymentModal from '../modals/NewDeploymentModal'
import ConnectModal from '../modals/ConnectModal'
import { API } from '../api/client'

const TYPE_BADGE = { rs: ['blue', 'Replica Set'], sharded: ['green', 'Sharded Cluster'], standalone: ['yellow', 'Standalone'] }
const STATUS_BADGE = { healthy: ['green', '● Healthy'], warning: ['yellow', '● Warning'], critical: ['red', '● Critical'] }

function DiskBar({ pct }) {
  if (!pct) return <span>—</span>
  const color = pct > 85 ? palette.red.base : pct > 70 ? palette.yellow.dark2 : palette.green.dark1
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 80, height: 8, borderRadius: 4, background: palette.gray.light2, overflow: 'hidden', display: 'inline-block' }}>
        <span style={{ display: 'block', height: '100%', width: `${pct}%`, background: color, borderRadius: 4 }} />
      </span>
      <span style={{ fontSize: 12, color }}>{pct}%</span>
    </span>
  )
}

function ClusterBlock({ c, toast, reload }) {
  const [tb, tl] = TYPE_BADGE[c.type] || TYPE_BADGE.rs
  const [sb, sl] = STATUS_BADGE[c.status] || STATUS_BADGE.healthy
  const [confirmTerminate, setConfirmTerminate] = useState(false)
  const [connectOpen, setConnectOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const doAction = async (fn, msg) => {
    setBusy(true)
    try { await fn(); toast(msg, '', 'success'); reload() }
    catch (e) { toast('Erro', e?.response?.data?.detail || String(e), 'warning') }
    finally { setBusy(false) }
  }

  const columns = [
    { header: 'Status', render: (n) => <Badge variant={n.status === 'green' ? 'green' : n.status === 'yellow' ? 'yellow' : 'red'}>● {n.status === 'green' ? 'Online' : n.status === 'yellow' ? 'Warning' : 'Offline'}</Badge> },
    { header: 'Host', render: (n) => <b>{n.host}</b> },
    { header: 'Role', render: (n) => <Badge variant={n.role.includes('PRIMARY') ? 'blue' : 'lightgray'}>{n.role}</Badge> },
    { header: 'Version', key: 'version' },
    { header: 'Uptime', key: 'uptime' },
    { header: 'Conn', key: 'conn' },
    { header: 'Disk', render: (n) => <DiskBar pct={n.disk} /> },
    { header: 'Lag', key: 'lag' },
    { header: 'Actions', render: (n, i) => (
      (n.role === 'PRIMARY' || n.role === 'Shard PRIMARY')
        ? <Button size="xsmall" onClick={() => doAction(() => API.stepDown(c.id, i), `Nova eleição em ${c.name}`)}>Step Down</Button>
        : (n.role !== 'mongos' && n.role !== 'Config Server')
          ? <Button size="xsmall" onClick={() => toast('Resync iniciado', n.host, 'success')}>Resync</Button>
          : null
    ) },
  ]

  return (
    <Card style={{ padding: 0, overflow: 'hidden', marginBottom: spacing[400] }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: `${spacing[300]}px ${spacing[400]}px`, background: palette.gray.light3, borderBottom: `1px solid ${palette.gray.light2}`, flexWrap: 'wrap' }}>
        <Badge variant={tb}>{tl}</Badge>
        <Subtitle style={{ fontSize: 15 }}>{c.name}</Subtitle>
        <Badge variant={sb}>{sl}</Badge>
        <Description style={{ marginLeft: 8 }}>MongoDB {c.version} · {c.nodes.length} node{c.nodes.length > 1 ? 's' : ''}</Description>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Button size="xsmall" variant="primary" leftGlyph={<Icon glyph="Connect" />} onClick={() => setConnectOpen(true)}>Connect</Button>
          {c.type === 'rs' && <Button size="xsmall" leftGlyph={<Icon glyph="Plus" />} onClick={() => doAction(() => API.addNode(c.id, {}), `Nó adicionado a ${c.name}`)} disabled={busy}>Add Node</Button>}
          <Button size="xsmall" leftGlyph={<Icon glyph="ArrowUp" />} onClick={() => doAction(() => API.upgradeCluster(c.id, { target_version: '7.0.6' }), `${c.name} atualizado para 7.0.6`)} disabled={busy}>Upgrade</Button>
          <Button size="xsmall" variant="dangerOutline" leftGlyph={<Icon glyph="Stop" />} onClick={() => setConfirmTerminate(true)}>Terminate</Button>
        </div>
      </div>
      <div style={{ padding: spacing[200] }}>
        <DataTable columns={columns} rows={c.nodes} />
      </div>
      <div style={{ padding: `${spacing[200]}px ${spacing[400]}px`, borderTop: `1px solid ${palette.gray.light2}` }}>
        <MetaRow items={[
          { label: 'Auth', value: 'SCRAM-SHA-256' }, { label: 'TLS', value: 'Enabled' },
          { label: 'Encryption', value: 'AES-256' }, { label: 'Backup', value: 'Active' },
        ]} />
      </div>

      <ConfirmationModal open={confirmTerminate} title={`Terminate ${c.name}?`} buttonText="Terminate"
        variant="danger" requiredInputText={c.name}
        onConfirm={() => { setConfirmTerminate(false); doAction(() => API.deleteCluster(c.id), `${c.name} terminado`) }}
        onCancel={() => setConfirmTerminate(false)}>
        Todos os dados serão perdidos. Digite <b>{c.name}</b> para confirmar.
      </ConfirmationModal>

      <ConnectModal open={connectOpen} cluster={c} onClose={() => setConnectOpen(false)} toast={toast} />
    </Card>
  )
}

export default function Deployments({ toast, refreshCounts }) {
  const [clusters, setClusters] = useState(null)
  const [newOpen, setNewOpen] = useState(false)

  const reload = () => API.clusters().then(setClusters).then(() => refreshCounts?.())
  useEffect(() => { reload() }, [])

  if (clusters === null) return <Loading />

  return (
    <div>
      <PageHeader title="All Clusters" subtitle={`${clusters.length} deployments · Project: Production`}
        actions={[<Button key="n" variant="primary" leftGlyph={<Icon glyph="Plus" />} onClick={() => setNewOpen(true)}>New Deployment</Button>]} />
      {clusters.map((c) => <ClusterBlock key={c.id} c={c} toast={toast} reload={reload} />)}
      <NewDeploymentModal open={newOpen} onClose={() => setNewOpen(false)} toast={toast} onCreated={reload} />
    </div>
  )
}
